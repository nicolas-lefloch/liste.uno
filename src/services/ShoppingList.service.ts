import firebase from 'firebase';
import { Subject } from 'rxjs';

import { Item } from '../datatypes/Item';
import CleverListService from './clever-list.service';

const listChange$ : Subject<Item[]> = new Subject();
let database : firebase.database.Database;
let listRef : firebase.database.Reference;

function saveLocally(shoppingList : Item[]) {
    localStorage.setItem('list', JSON.stringify(shoppingList));
}

function init() {
    firebase.initializeApp({
        databaseURL: 'https://liste-de-course-6799d.firebaseio.com/',
    });
    database = firebase.database();
    listRef = database.ref('/lists/abzf/');
    database.ref('/lists/abzf/current').on('value',
        (snapshot) => {
            // console.log(snapshot);
            const listValue = snapshot.val();
            const itemList = listValue ? Object.entries(listValue).map(
                ([key, item]) => ({ ...(item as Item), key }),
            ) : [];
            // console.log(itemList.map((i) => i.name));
            saveLocally(itemList);
            listChange$.next(itemList);
        });
}

init();

export default class ShoppingService {
    static addItem(item: Item) : Item {
        let localList = this.getLocalList();
        // Duplicates handling
        const { itemToRemove, itemToAdd } = CleverListService.handleQuantities(localList, item);
        if (itemToRemove) {
            listRef.child('current').child(itemToRemove.key).remove();
            localList = localList.filter((i) => i.key !== itemToRemove.key);
        }
        localList.push(itemToAdd);
        saveLocally(localList);
        const { key } = listRef.child('current').push(itemToAdd);
        return { ...item, key };
    }

    static removeItem(itemKey : string) {
        saveLocally(this.getLocalList().filter((i) => i.key !== itemKey));
        listRef.child('current').child(itemKey).remove();
    }

    static updateItem(item : Item) {
        saveLocally(this.getLocalList().map(
            (it) => (it.key === item.key ? item : it),
        ));
        listRef.child(`current/${item.key}`).update(item);
    }

    static getListChangeListener() {
        return listChange$.asObservable();
    }

    static getLocalList() : Item[] {
        return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
    }
}
