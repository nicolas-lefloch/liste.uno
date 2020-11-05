import React, { useState } from 'react';
import CleverListService from '../services/clever-list.service';
import TransportService from '../services/transport.service';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';

const BuildShoppingList = () => {
    const [list, setList] = useState(TransportService.getList);

    const addItemToList = (items : Item[]) => {
        const newList = CleverListService.regroupByName(list, items);
        setList(newList);
        TransportService.saveList(newList);
    };

    const deleteItem = (id) => {
        const newList = list.filter((e) => e.id !== id);
        setList(newList);
        TransportService.saveList(newList);
    };

    const itemList = list.map(
        (item) => <ItemRow key={item.id} item={item} onDelete={() => deleteItem(item.id)} />,
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
