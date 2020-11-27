import firebase from 'firebase/app';
import 'firebase/database';
import { Subject } from 'rxjs';
import ConfigData from '../config.json';

import { Item } from '../datatypes/Item';
import { ShoppingList } from '../datatypes/ShoppingList';
import LocationService from './LocationService';
import QuantityComputingService from './QuantityComputing.service';

firebase.initializeApp({
    databaseURL: ConfigData.FIREBASE_URL,
});

export default class ShoppingService {
    static listChange$ : Subject<Item[]>;

    static listRef : firebase.database.Reference;

    static saveLocally(shoppingList : Item[]) {
        const currentListID = ShoppingService.getCurrentListID();
        const listMap = ShoppingService.getListMap();
        listMap[currentListID] = { id: currentListID, name: currentListID, list: shoppingList };
        localStorage.setItem('listMap', JSON.stringify(listMap));
    }

    static getListMap() :{[listId : string] : ShoppingList} {
        const existingListMap = localStorage.getItem('listMap');
        if (existingListMap) {
            return JSON.parse(existingListMap) as {[listId : string] : ShoppingList};
        }
        return {};
    }

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
        //    this.listChange$.complete();
        } else {
            ShoppingService.listChange$ = new Subject();
        }
        ShoppingService.listRef.child('current').on('value',
            (snapshot) => {
                const listValue = snapshot.val();
                const itemList = listValue ? Object.entries(listValue).map(
                    ([key, item]) => ({ ...(item as Item), key }),
                ) : [];
                ShoppingService.saveLocally(itemList);
                ShoppingService.listChange$.next(itemList);
            });
        ShoppingService.listRef.child('location_enabled').once('value',
            (snapshot) => {
                if (snapshot.val()) {
                    LocationService.startGeoTracking();
                }
            });
        localStorage.setItem('currentListID', listId);
        console.log('do the next  ');
        ShoppingService.listChange$.next(ShoppingService.getLocalList());
        console.log(ShoppingService.getLocalList());
    }

    /**
     * Get potential list ID store in local storage
     */
    static getCurrentListID():string {
        const existingID = localStorage.getItem('currentListID');
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
        ShoppingService.saveLocally(localList);
        return newItemWithKey;
    }

    static removeItem(itemKey : string) {
        ShoppingService.saveLocally(this.getLocalList().filter((i) => i.key !== itemKey));
        const itemRef = ShoppingService.listRef.child(`current/${itemKey}`);
        itemRef.once('value',
            (snapshot) => {
                ShoppingService.listRef.child('archived').push(snapshot.val());
                itemRef.remove();
            });
    }

    static updateItem(item : Item) {
        ShoppingService.saveLocally(this.getLocalList().map(
            (it) => (it.key === item.key ? item : it),
        ));
        ShoppingService.listRef.child(`current/${item.key}`).update(item);
    }

    static getListChangeListener() {
        return ShoppingService.listChange$.asObservable();
    }

    static getLocalList() : Item[] {
        const currentListID = ShoppingService.getCurrentListID();
        const listMap = ShoppingService.getListMap();
        if (listMap[currentListID]) {
            return listMap[currentListID].list;
        }
        return [];
    }
}
