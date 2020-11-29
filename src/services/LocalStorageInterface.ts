import { Item } from '../datatypes/Item';
import { ShoppingList } from '../datatypes/ShoppingList';

class LocalStorageInterface {
    static getLists() {
        const existingLists = localStorage.getItem('shoppingLists');
        if (existingLists) {
            return JSON.parse(existingLists) as { [listId: string]: ShoppingList };
        }
        return {};
    }

    static saveLists(shoppingLists: { [listId: string]: ShoppingList }) {
        localStorage.setItem('shoppingLists', JSON.stringify(shoppingLists));
    }

    static saveListItems(listId: string, itemList: Item[]) {
        const localLists = LocalStorageInterface.getLists();
        localLists[listId] = {
            id: listId,
            name: localLists[listId] ? localLists[listId].name : listId,
            items: itemList,
        };
        LocalStorageInterface.saveLists(localLists);
    }

    static getListItems(listId: string) {
        const localLists = LocalStorageInterface.getLists();
        return localLists[listId] ? localLists[listId].items : [];
    }

    static getCurrentListId() {
        return localStorage.getItem('currentListID');
    }

    static setCurrentListId(listId:string) {
        localStorage.setItem('currentListID', listId);
    }
}

export default LocalStorageInterface;
