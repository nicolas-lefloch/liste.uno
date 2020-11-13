import firebase from 'firebase/app';
import 'firebase/database';
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
        localStorage.setItem('defaultListID', listId);
    }

    static getDefaultListID():string {
        const existingID = localStorage.getItem('defaultListID');
        return existingID || ShoppingService.generateRandomId();
    }

    private static generateRandomId() :string {
        const consonnants = 'bcdfghjklmnpqrstvxz';
        const vowels = 'aeiou';
        const randomChar = (characters:string) => characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
        const res = [...Array(4).keys()].map(
            (i) => (i % 2 === 0 ? randomChar(consonnants) : randomChar(vowels)),
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
                ShoppingService.listRef.child('archived').push(snapshot.val());
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
}
