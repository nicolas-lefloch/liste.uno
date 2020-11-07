import React, { useEffect, useState } from 'react';
// import CleverListService from '../services/clever-list.service';
import ShoppingListService from '../services/ShoppingList.service';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';

const BuildShoppingList = () => {
    const [list, setList] = useState<Item[]>(ShoppingListService.getLocalList());
    const [editedItemKey, setEditedItemKey] = useState<string>();
    useEffect(() => {
        ShoppingListService.getListChangeListener().subscribe(
            (l) => {
                setList(l);
            },
        );
    }, []);

    const addItemsToList = (newItems : Item[]) => {
        newItems.map(
            (item) => ShoppingListService.addItem(item),
        );
        setList(ShoppingListService.getLocalList());
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
                editable={editedItemKey === item.key}
                onToggleEdition={
                    (shouldEdit) => setEditedItemKey(shouldEdit ? item.key : undefined)
                }
                onDelete={() => deleteItem(item.key)}
            />
        ),
    );

    itemList.reverse();

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
