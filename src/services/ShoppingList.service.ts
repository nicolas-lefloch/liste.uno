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

firebase.initializeApp({
    databaseURL: 'https://liste-de-course-6799d.firebaseio.com/',
});

function generateID(length) {
    const existingID = localStorage.getItem('existingID');
    if (existingID !== null && existingID !== undefined) {
        return existingID;
    }

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    localStorage.setItem('existingID', result);
    return result;
}

export default class ShoppingService {
    static init(dataID) : number {
        let id = dataID;

        if (id === null || id === undefined) {
            id = generateID(8);
        }

        database = firebase.database();
        listRef = database.ref(`/lists/${id}/`);
        database.ref(`/lists/${id}/current`).on('value',
            (snapshot) => {
                const listValue = snapshot.val();
                const itemList = listValue ? Object.entries(listValue).map(
                    ([key, item]) => ({ ...(item as Item), key }),
                ) : [];
                saveLocally(itemList);
                listChange$.next(itemList);
            });
        return id;
    }

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
