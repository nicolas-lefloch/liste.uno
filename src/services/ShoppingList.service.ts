import firebase from 'firebase/app';
import 'firebase/database';
import { stringify } from 'querystring';
import { Subject } from 'rxjs';
import ConfigData from '../config.json';

import { Item } from '../datatypes/Item';
import LocationService from './LocationService';
import QuantityComputingService from './QuantityComputing.service';

function saveLocally(shoppingList : Item[]) {
    localStorage.setItem('list', JSON.stringify(shoppingList));
}
firebase.initializeApp({
    databaseURL: ConfigData.FIREBASE_URL,
});

export default class ShoppingService {
    static listChange$ : Subject<Item[]>;

    static listRef : firebase.database.Reference;

    /**
     * connect database to list by listId
     * @param listId id of the list
     */
    static setCurrentList(listId : string) {
        if (ShoppingService.listRef) {
            ShoppingService.listRef.off();
        }
        ShoppingService.listRef = firebase.database().ref(`/lists/${listId}/`);
        if (this.listChange$) {
            this.listChange$.complete();
        }
        ShoppingService.listChange$ = new Subject();
        ShoppingService.listRef.child('current').on('value',
            (snapshot) => {
                const listValue = snapshot.val();
                const itemList = listValue ? Object.entries(listValue).map(
                    ([key, item]) => ({ ...(item as Item), key }),
                ) : [];
                saveLocally(itemList);
                ShoppingService.listChange$.next(itemList);
            });
        ShoppingService.listRef.child('location_enabled').once('value',
            (snapshot) => {
                if (snapshot.val()) {
                    LocationService.startGeoTracking();
                }
            });
        ShoppingService.listRef.child('archived').once('value',
            (snapshot) => {
                const archivedItems = snapshot.val();
                const itemList = archivedItems ? Object.entries(archivedItems).map(
                    ([key, item]) => ({ ...(item as Item), key }),
                ) : [];
                localStorage.setItem('archivedItems', JSON.stringify(itemList));
            });
        localStorage.setItem('defaultListID', listId);
    }

    /**
     * Get potential list ID store in local storage
     */
    static getDefaultListID():string {
        const existingID = localStorage.getItem('defaultListID');
        return existingID || ShoppingService.generateRandomId();
    }

    /**
     * Generate a pronounceable 4 chars id
     */
    private static generateRandomId() :string {
        const consonants = 'bcdfghjklmnpqrstvxz';
        const vowels = 'aeiou';
        const randomChar = (characters:string) => characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
        const res = [...Array(4).keys()].map(
            (i) => (i % 2 === 0 ? randomChar(consonants) : randomChar(vowels)),
        ).join('');
        return res;
    }

    static addItem(item: Item) : Item {
        let localList = this.getLocalList();
        // Duplicates handling
        const {
            itemToRemove,
            itemToAdd,
        } = QuantityComputingService.handleQuantities(localList, item);
        if (itemToRemove) {
            ShoppingService.listRef.child('current').child(itemToRemove.key).remove();
            localList = localList.filter((i) => i.key !== itemToRemove.key);
        }

        console.log('item to add', itemToAdd);
        const { key } = ShoppingService.listRef.child('current').push(itemToAdd);
        const newItemWithKey : Item = { ...itemToAdd, key };
        localList.push(newItemWithKey);
        saveLocally(localList);
        return newItemWithKey;
    }

    static removeItem(itemKey : string) {
        saveLocally(this.getLocalList().filter((i) => i.key !== itemKey));
        const itemRef = ShoppingService.listRef.child(`current/${itemKey}`);
        itemRef.once('value',
            (snapshot) => {
                const val :Item = snapshot.val();
                if (val.bought) {
                    ShoppingService.listRef.child('archived').push(val);
                }
                itemRef.remove();
            });
    }

    static updateItem(item : Item) {
        saveLocally(this.getLocalList().map(
            (it) => (it.key === item.key ? item : it),
        ));
        ShoppingService.listRef.child(`current/${item.key}`).update(item);
    }

    static getListChangeListener() {
        return ShoppingService.listChange$.asObservable();
    }

    static getLocalList() : Item[] {
        return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
    }

    static getFrequentArticles(maxArticles : number, excludeItems : Item[]) : Item[] {
        const archivedItemsStr = localStorage.getItem('archivedItems');
        if (!archivedItemsStr) {
            return [];
        }
        const archivedItems:Item[] = JSON.parse(archivedItemsStr);
        const itemsNoQuantity : Item[] = archivedItems
            .map((item) => ({
                category: item.category ? item.category : null,
                name: QuantityComputingService.itemNameWithoutQuantity(item),
                bought: false,
                lastUpdate: new Date().getTime(),
            }));
        const itemOccurences : {[id : string] : {item : Item, count : number}} = itemsNoQuantity.reduce(
            (acc, curr) => {
                if (acc[curr.name]) {
                    acc[curr.name].count += 1;
                } else {
                    acc[curr.name] = { item: curr, count: 1 };
                }
                return acc;
            },
            {},
        );
        const sorted = Object.entries(itemOccurences).sort((a, b) => b[1].count - a[1].count)
            .map((a) => a[1].item);
        const withoutExcluded = sorted.filter((item) => excludeItems.find(
            (i) => QuantityComputingService.itemNameWithoutQuantity(i) === item.name,
        ) === undefined);
        return withoutExcluded.slice(0, maxArticles);
    }
}
