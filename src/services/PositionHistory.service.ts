import firebase from 'firebase/app';
import { Item } from '../datatypes/Item';
import LocalStorageInterface from './LocalStorageInterface';

class PositionHistoryService {
<<<<<<< HEAD
    static listRef = firebase.database().ref(`/lists/${LocalStorageInterface.getCurrentListId()}/archived`)
=======
    static listRef = firebase.database().ref(`/lists/${ShoppingService.getCurrentListID()}/archived`)
>>>>>>> 9de9b9c... add multilist support

    static getAllPositionedItems():Promise<Item[]> {
        return new Promise((resolve) => {
            this.listRef.once('value', (snapshot) => {
                const archivedArticles : {[key : string] : Item} = snapshot.val();
                resolve(archivedArticles
                    ? Object.values(archivedArticles)
                        .filter((i) => !!i.boughtLocation)
                    : []);
            });
        });
    }
}
export default PositionHistoryService;
