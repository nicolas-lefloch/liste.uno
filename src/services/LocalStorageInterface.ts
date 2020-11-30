import { Item } from '../datatypes/Item';
import { ShoppingList } from '../datatypes/ShoppingList';
import ListIndexService from './ListIndex.service';

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
            name: localLists[listId] ? localLists[listId].name : '',
            items: itemList,
        };
        console.log('saving list item ', localLists[listId].name);
        LocalStorageInterface.saveLists(localLists);
    }

    static getListItems(listId: string) {
        const localLists = LocalStorageInterface.getLists();
        return localLists[listId] ? localLists[listId].items : [];
    }

    /**
     * Retrieve the current list id in local storage
     * If no id exists (e.g. when the user first visits the website), a random id is generated
     * Does not ensure the id is not already taken in the db
     * (the user could land on a list belonging to another user)
     */
    static getCurrentListId(): string {
        const existingID = localStorage.getItem('currentListID');
        return existingID || LocalStorageInterface.generateRandomId();
    }

    /**
     * Generate a pronounceable 4 chars string
     */
    private static generateRandomId(): string {
        const consonants = 'bcdfghjklmnpqrstvxz';
        const vowels = 'aeiou';
        const randomChar = (characters: string) => characters.charAt(
            Math.floor(Math.random() * characters.length),
        );
        const res = [...Array(4).keys()].map(
            (i) => (i % 2 === 0 ? randomChar(consonants) : randomChar(vowels)),
        ).join('');
        return res;
    }

    static setCurrentListId(listId: string) {
        localStorage.setItem('currentListID', listId);
    }

    static setCurrentListName(listName: string) {
        const currentListId = LocalStorageInterface.getCurrentListId();
        LocalStorageInterface.setListName(currentListId, listName);
    }

    static setListName(listId : string, listName: string) {
        const localLists = LocalStorageInterface.getLists();
        localLists[listId] = {
            id: listId,
            name: listName,
            items: localLists[listId] ? localLists[listId].items : [],
        };
        LocalStorageInterface.saveLists(localLists);
    }

    static removeList(listId : string) {
        const localLists = LocalStorageInterface.getLists();
        delete localLists[listId];
        LocalStorageInterface.saveLists(localLists);
        return localLists;
    }
}

export default LocalStorageInterface;
