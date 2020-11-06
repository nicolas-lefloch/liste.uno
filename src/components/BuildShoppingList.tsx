import React, { useState } from 'react';
// import CleverListService from '../services/clever-list.service';
import ShoppingListService from '../services/ShoppingList.service';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';

const BuildShoppingList = () => {
    const shoppingListService = new ShoppingListService();

    const [list, setList] = useState<Item[]>(shoppingListService.getLocalList());

    shoppingListService.getListChangeListener().subscribe(
        (l) => setList(l),
    );

    const addItemsToList = (newItems : Item[]) => {
        const withKey = newItems.map(
            (item) => shoppingListService.addItem(item),
        );
        setList([...list, ...withKey]);
    };

    const deleteItem = (key) => {
        const newList = list.filter((e) => e.key !== key);
        setList(newList);
        shoppingListService.removeItem(key);
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
