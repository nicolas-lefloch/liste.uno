import firebase from 'firebase/app';
import ShoppingService from './ShoppingList.service';
import { Item } from '../datatypes/Item';

class PositionHistoryService {
    static listRef = firebase.database().ref(`/lists/${ShoppingService.getCurrentListID()}/archived`)

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
