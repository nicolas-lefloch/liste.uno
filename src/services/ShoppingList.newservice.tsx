import React, { useContext, useState } from 'react';

import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import QuantityComputingService from './QuantityComputing.service';
import { Item } from '../datatypes/Item';
import { ShoppingList } from '../datatypes/ShoppingList';
import ConfigData from '../config.json';
import LocationService from './LocationService';
import LocalStorageInterface from './LocalStorageInterface';
import ListIndexService from './ListIndex.service';

if (!firebase.apps.length) {
    firebase.initializeApp({
        databaseURL: ConfigData.FIREBASE_URL,
    });
}

interface ShoppingListContextDescription {
    shoppingList: ShoppingList;
    removeItem: (itemKey: string) => void;
    updateItem: (item: Item) => void;
    addItem: (item: Item) => Item;
    getFrequentArticles:(maxArticles : number, excludeItems : Item[])=> Item[];
}
const ShoppingListContext = React.createContext(null as ShoppingListContextDescription);

const getListRef = (listID: string) => firebase.database().ref(`/lists/${listID}/`);

const sortFrequentArticles = (articles: Item[]) => {
    const itemsNoQuantity: Item[] = articles
        .map((item) => ({
            category: item.category ? item.category : null,
            name: QuantityComputingService.itemNameWithoutQuantity(item),
            bought: false,
            lastUpdate: new Date().getTime(),
        }));
    const itemOccurences: { [id: string]: { item: Item, count: number } } = itemsNoQuantity.reduce(
        (acc, curr) => {
            if (acc[curr.name]) {
                acc[curr.name].count += 1;
            } else {
                acc[curr.name] = { item: curr, count: 1 };
            }
            return acc;
        },
        {},
    );
    const sorted = Object.entries(itemOccurences).sort((a, b) => b[1].count - a[1].count)
        .map((a) => a[1].item);
    return sorted;
};

const setCurrentList = (newListID: string, onListUpdated: (itemList: Item[]) => void, onFrequentArticlesFound: (articles: Item[]) => void) => {
    /** Removes the subscription on the previous list */
    getListRef(LocalStorageInterface.getCurrentListId()).child('current').off('value');

    /** Immediately outputs the items from local storage
     * If offline, it will be the unique call of onListUpdated
     */
    onListUpdated(LocalStorageInterface.getListItems(newListID));

    const listRef = getListRef(newListID);
    /** Subscribes only if the user is online at the time of set current list */
    listRef.child('current').on('value',
        (snapshot) => {
            const listValue = snapshot.val();
            const itemList = listValue ? Object.entries(listValue).map(
                ([key, item]) => ({ ...(item as Item), key }),
            ) : [];
            onListUpdated(itemList);
            LocalStorageInterface.saveListItems(newListID, itemList);
        });
    listRef.child('location_enabled').once('value',
        (snapshot) => {
            if (snapshot.val()) {
                LocationService.startGeoTracking();
            }
        });
    listRef.child('archived').once('value',
        (snapshot) => {
            const archivedItems = snapshot.val();
            const itemList = archivedItems ? Object.entries(archivedItems).map(
                ([key, item]) => ({ ...(item as Item), key }),
            ) : [];
            const itemsArranged = sortFrequentArticles(itemList);
        });

    LocalStorageInterface.setCurrentListId(newListID);
};

const removeItemInDB = (listID: string, itemKey: string,
    onLocalListUpdated: (shoppingList: ShoppingList) => void) => {
    /** Locally */
    const items = LocalStorageInterface.getListItems(listID);
    LocalStorageInterface.saveListItems(listID, items.filter((item) => item.key !== itemKey));
    onLocalListUpdated(LocalStorageInterface.getLists()[listID]);

    /** Online */
    const listRef = getListRef(listID);
    const itemRef = listRef.child(`current/${itemKey}`);
    itemRef.once('value',
        (snapshot) => {
            const value = snapshot.val() as Item;
            if (value.bought) {
                listRef.child('archived').push(snapshot.val());
            }
            itemRef.remove();
        });
};

const addItemInDB = (listId: string, item: Item,
    onLocalListUpdated: (shoppingList: ShoppingList) => void): Item => {
    /** Schedules the adding online, but immediately returns the key */
    const { key } = getListRef(listId).child('current').push(item);
    const newItemWithKey: Item = { ...item, key };

    const items = LocalStorageInterface.getListItems(listId);
    if (!items.find((i) => i.key === key)) {
        items.push(newItemWithKey);
        LocalStorageInterface.saveListItems(listId, items);
    }
    onLocalListUpdated(LocalStorageInterface.getLists()[listId]);
    return newItemWithKey;
};

const updateItemInDB = (listId: string, item: Item,
    onLocalListUpdated: (shoppingList: ShoppingList) => void) => {
    /** Locally */
    const items = LocalStorageInterface.getListItems(listId);
    LocalStorageInterface.saveListItems(listId,
        items.map((it) => (it.key === item.key ? item : it)));
    onLocalListUpdated(LocalStorageInterface.getLists()[listId]);

    /** Online */
    getListRef(listId).child(`current/${item.key}`).update(item);
};

export const ShoppingListProvider: React.FC<{ children }> = ({ children = null }) => {
    const [itemList, setItemList] = useState<Item[]>([]);

    const [frequentArticles, setFrequentArticles] = useState([]);

    /** Handle list change */
    const urlListID = (useParams<{ listID: string }>()).listID;
    const [listId, setListId] = useState<string>('');

    if (urlListID && urlListID !== listId) {
        setCurrentList(urlListID, setItemList, setFrequentArticles);
        setListId(urlListID);
    }

    const removeItem = (itemKey: string) => removeItemInDB(listId, itemKey,
        (shoppingList) => setItemList(shoppingList.items));
    const updateItem = (item: Item) => updateItemInDB(listId, item,
        (shoppingList) => setItemList(shoppingList.items));
    const addItem = (item: Item) => {
        // Duplicates handling
        const {
            itemToRemove,
            itemToAdd,
        } = QuantityComputingService.handleQuantities(itemList, item);
        if (itemToRemove) {
            removeItemInDB(listId, itemToRemove.key, () => { });
        }

        return addItemInDB(listId, itemToAdd,
            (shoppingList) => setItemList(shoppingList.items));
    };

    const getFrequentArticles = (maxArticles :number, excludeItems:Item[]) => {
        const withoutExcluded = frequentArticles.filter((item) => excludeItems.find(
            (i) => QuantityComputingService.itemNameWithoutQuantity(i) === item.name,
        ) === undefined);
        return withoutExcluded.slice(0, maxArticles);
    };

    const value: ShoppingListContextDescription = {
        shoppingList: {
            name: listId,
            id: listId,
            items: itemList,
        },
        removeItem,
        updateItem,
        addItem,
        getFrequentArticles,
    };
    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
};

export const useShoppingList = () => useContext(ShoppingListContext);
