import firebase from 'firebase';
import { Subject } from 'rxjs';

import { Item } from '../datatypes/Item';

firebase.initializeApp({
    databaseURL: 'https://liste-de-course-6799d.firebaseio.com/',
});
export default class ShoppingListService {
    private database : firebase.database.Database;

    private listRef :firebase.database.Reference;

    private listChange$ : Subject<Item[]> = new Subject();

    private shoppingList : Item[]

    constructor() {
        this.shoppingList = localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
        this.database = firebase.database();
        this.listRef = this.database.ref('/lists/abzf/');
        this.database.ref('/lists/abzf/current').on('value',
            (snapshot) => {
                const itemList = Object.entries(snapshot.val()).map(
                    ([key, item]) => ({ ...(item as Item), key }),
                );
                this.shoppingList = itemList;
                console.log(itemList);

                this.saveLocally();
                this.listChange$.next(itemList);
            });
    }

    private saveLocally() {
        localStorage.setItem('list', JSON.stringify(this.shoppingList));
    }

    public addItem(item: Item) : Item {
        this.shoppingList.push(item);
        this.saveLocally();
        const { key } = this.listRef.child('current').push(item);
        return { ...item, key };
    }

    public removeItem(itemKey : string) {
        this.shoppingList = this.shoppingList.filter((i) => i.key !== itemKey);
        this.saveLocally();
        this.listRef.child('current').child(itemKey).remove();
    }

    public updateItem(item : Item) {
        this.shoppingList = this.shoppingList.map(
            (it) => (it.key === item.key ? item : it),
        );
        this.saveLocally();
        this.listRef.child(`current/${item.key}`).update(item);
    }

    public getListChangeListener() {
        return this.listChange$.asObservable();
    }

    public getLocalList() : Item[] {
        return [...this.shoppingList];
    }
}
