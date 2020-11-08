import firebase from 'firebase';
import { Subject } from 'rxjs';

import { Item } from '../datatypes/Item';
import CleverListService from './clever-list.service';

function saveLocally(shoppingList : Item[]) {
    localStorage.setItem('list', JSON.stringify(shoppingList));
}

firebase.initializeApp({
    databaseURL: 'https://liste-de-course-6799d.firebaseio.com/',
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
        const { itemToRemove, itemToAdd } = CleverListService.handleQuantities(localList, item);
        if (itemToRemove) {
            ShoppingService.listRef.child('current').child(itemToRemove.key).remove();
            localList = localList.filter((i) => i.key !== itemToRemove.key);
        }

        localList.push(itemToAdd);
        saveLocally(localList);
        const { key } = ShoppingService.listRef.child('current').push(itemToAdd);
        return { ...item, key };
    }

    static removeItem(itemKey : string) {
        saveLocally(this.getLocalList().filter((i) => i.key !== itemKey));
        ShoppingService.listRef.child('current').child(itemKey).remove();
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
