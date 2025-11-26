import React, { useContext, useEffect, useState } from 'react';

import { useParams } from 'react-router';
import  { getApps, initializeApp } from 'firebase/app';
import QuantityComputingService from './QuantityComputing.service';
import type { Item } from '../datatypes/Item';
import type { ShoppingList } from '../datatypes/ShoppingList';
import ConfigData from '../config.json';
import LocationService from './LocationService';
import LocalStorageInterface from './LocalStorageInterface';
import { child, getDatabase, off, onValue, ref , get, push, update} from 'firebase/database';
import { remove } from 'firebase/database';

if (!getApps().length) {
    initializeApp({
        databaseURL: ConfigData.FIREBASE_URL,
    });
}

interface ShoppingListContextDescription {
    shoppingList: ShoppingList;
    removeItem: (itemKey: string) => void;
    updateItem: (item: Item) => void;
    addItem: (item: Item) => Item;
    frequentArticles : Item[];
}
const ShoppingListContext = React.createContext<ShoppingListContextDescription|undefined>(undefined);

const getListRef = (listID: string) => ref(getDatabase(), `/lists/${listID}/`);

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
    off(child(getListRef(LocalStorageInterface.getCurrentListId()),'current'), 'value');

    /** Immediately outputs the items from local storage
     * If offline, it will be the unique call of onListUpdated
     */
    onListUpdated(LocalStorageInterface.getListItems(newListID));

    const listRef = getListRef(newListID);
    /** Subscribes only if the user is online at the time of set current list */
    onValue(child(listRef, 'current'),
        (snapshot) => {
            const listValue = snapshot.val();
            const itemList = listValue ? Object.entries(listValue).map(
                ([key, item]) => ({ ...(item as Item), key }),
            ) : [];
            onListUpdated(itemList);
            LocalStorageInterface.saveListItems(newListID, itemList);
        });
    get(child(listRef, 'location_enabled')).then(
        (snapshot) => {
            if (snapshot.val()) {
                LocationService.startGeoTracking();
            }
        });
    get(child(listRef, 'archived')).then(
        (snapshot) => {
            const archivedItems = snapshot.val();
            const itemList = archivedItems ? Object.entries(archivedItems).map(
                ([key, item]) => ({ ...(item as Item), key }),
            ) : [];
            const itemsArranged = sortFrequentArticles(itemList);
            onFrequentArticlesFound(itemsArranged);
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
    const itemRef = child(listRef, `current/${itemKey}`);
    get(itemRef).then(
        (snapshot) => {
            const value = snapshot.val() as Item;
            if (value && value.bought) {
                push(child(listRef, 'archived'), snapshot.val());
            }
            remove(itemRef)
        });
};

const addItemInDB = (listId: string, item: Item,
    onLocalListUpdated: (shoppingList: ShoppingList) => void): Item => {
    /** Schedules the adding online, but immediately returns the key */
    const { key } = push(child(getListRef(listId),'current'));
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
    update(child(getListRef(listId), `current/${item.key}`), item);
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
    const updateItem = (item: Item) => updateItemInDB(listId, { ...item, lastUpdate: new Date().getTime() },
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

    const value: ShoppingListContextDescription = {
        shoppingList: {
            name: listId,
            id: listId,
            items: itemList,
        },
        removeItem,
        updateItem,
        addItem,
        frequentArticles,
    };
    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
};

export const useShoppingList = () => useContext(ShoppingListContext);
