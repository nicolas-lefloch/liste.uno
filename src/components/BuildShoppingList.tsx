import React, { useEffect, useState } from 'react';
// import CleverListService from '../services/clever-list.service';
import ShoppingListService from '../services/ShoppingList.service';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';

const BuildShoppingList = () => {
    const [list, setList] = useState<Item[]>(ShoppingListService.getLocalList());
    useEffect(() => {
        ShoppingListService.getListChangeListener().subscribe(
            (l) => {
                console.log(`change from firebase, setting list to ${l.map((e) => `${e.name},${e.key}`)}`);
                setList(l);
            },
        );
    }, []);

    const addItemsToList = (newItems : Item[]) => {
        const withKey = newItems.map(
            (item) => ShoppingListService.addItem(item),
        );
        console.log(`sdk answered, appending ${withKey.map((e) => `${e.name},${e.key}`)} to ${list.map((e) => `${e.name},${e.key}`)}`);
        setList([...list, ...withKey]);
    };

    const deleteItem = (key) => {
        const newList = list.filter((e) => e.key !== key);
        setList(newList);
        ShoppingListService.removeItem(key);
    };

    const itemList = list.map(
        (item) => (
            <ItemRow
                key={item.key + item.lastUpdate}
                item={item}
                onDelete={() => deleteItem(item.key)}
            />
        ),
    );

    console.log(list);

    return (
        <div className="itemList">
            <ItemInput placeholder="Ajouter un item" onItemsOutput={addItemsToList} />
            <ol>
                {itemList}
            </ol>
        </div>
    );
};

export default BuildShoppingList;
