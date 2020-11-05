import React, { useState } from 'react';
import ItemRow from './ItemRow';

const WhileShoppingList = () => {
    const [list, setList] = useState([{ id: 1, value: 'Banane' },
        { id: 2, value: 'Pomme' },
        { id: 3, value: 'Café' },
        { id: 4, value: 'Beurre' }]);

    const deleteItem = (id) => {
        setList(list.filter((e) => e.id !== id));
    };

    const itemList = list.map(
        (item) => <ItemRow key={item.id} item={item} onDelete={() => deleteItem(item.id)} />,
    );

    return (
        <div className="whileShoppingList">
            <ol>
                {itemList}
            </ol>
        </div>
    );
};

export default WhileShoppingList;
