import React, { useState } from 'react';
import CleverListService from '../clever-list.service';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';

const BuildShoppingList = () => {
    const [list, setList] = useState([{ id: 1, value: 'Banane' },
        { id: 2, value: 'Pomme' },
        { id: 3, value: 'Café' },
        { id: 4, value: 'Beurre' }]);

    const addItemToList = (items : Item[]) => {
        setList(CleverListService.regroupByName(list, items));
    };

    const deleteItem = (id) => {
        setList(list.filter((e) => e.id !== id));
    };

    const itemList = list.map(
        (item) => <ItemRow key={item.id} name={item.value} onDelete={() => deleteItem(item.id)} />,
    );

    return (
        <div className="itemList">
            <ItemInput placeholder="Ajouter un item" onItemsOutput={addItemToList} />
            <ol>
                {itemList}
            </ol>
        </div>
    );
};

export default BuildShoppingList;
