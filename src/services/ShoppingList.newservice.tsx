import React, { useContext, useState } from 'react';

import { useParams } from 'react-router-dom';
import firebase from 'firebase/app';
import QuantityComputingService from './QuantityComputing.service';
import { Item } from '../datatypes/Item';
import { ShoppingList } from '../datatypes/ShoppingList';
import ConfigData from '../config.json';
import LocationService from './LocationService';
import LocalStorageInterface from './LocalStorageInterface';

console.log('checking for app init, ', firebase.apps.length);
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
}
const ShoppingListContext = React.createContext(null as ShoppingListContextDescription);

const getListRef = (listID: string) => firebase.database().ref(`/lists/${listID}/`);

const setCurrentList = (newListID: string, onListUpdated: (itemList: Item[]) => void) => {
    console.log('do the set current list');
    const listRef = getListRef(newListID);
    listRef.child('current').on('value',
        (snapshot) => {
            const listValue = snapshot.val();
            const itemList = listValue ? Object.entries(listValue).map(
                ([key, item]) => ({ ...(item as Item), key }),
            ) : [];
            console.log('list update, will append : ', itemList.map((i) => i.name));
            onListUpdated(itemList);
            LocalStorageInterface.saveListItems(newListID, itemList);
        });
    listRef.child('location_enabled').once('value',
        (snapshot) => {
            if (snapshot.val()) {
                LocationService.startGeoTracking();
            }
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

const addItemInDB = (listId: string, item: Item, existingList: Item[],
    onLocalListUpdated: (shoppingList: ShoppingList) => void): Item => {
    console.log('add to db : ', item);
    // Duplicates handling
    const {
        itemToRemove,
        itemToAdd,
    } = QuantityComputingService.handleQuantities(existingList, item);
    if (itemToRemove) {
        removeItemInDB(listId, itemToRemove.key, () => { });
    }
    /** Schedules the adding online, but immediately returns the key */
    const { key } = getListRef(listId).child('current').push(itemToAdd);
    const newItemWithKey: Item = { ...itemToAdd, key };

    /** add online triggered the local update actually */
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

    /** Handle list change */
    const urlListID = (useParams<{ listID: string }>()).listID;
    const [listId, setListId] = useState<string>('');
    if (urlListID && urlListID !== listId) {
        setCurrentList(urlListID, setItemList);
        setListId(urlListID);
    }

    const removeItem = (itemKey: string) => removeItemInDB(listId, itemKey,
        (shoppingList) => setItemList(shoppingList.items));
    const updateItem = (item: Item) => updateItemInDB(listId, item,
        (shoppingList) => setItemList(shoppingList.items));
    const addItem = (item: Item) => addItemInDB(listId, item, itemList,
        (shoppingList) => setItemList(shoppingList.items));

    const value: ShoppingListContextDescription = {
        shoppingList: {
            name: listId,
            id: listId,
            items: itemList,
        },
        removeItem,
        updateItem,
        addItem,
    };
    return (
        <ShoppingListContext.Provider value={value}>
            {children}
        </ShoppingListContext.Provider>
    );
};

export const useShoppingList = () => useContext(ShoppingListContext);
