import React, { useState } from 'react';
import WhileShoppingItemRow from './WhileShoppingItemRow';

const WhileShoppingList = () => {
    const [list] = useState([{ id: 1, value: 'Banane' },
        { id: 2, value: 'Pomme' },
        { id: 3, value: 'Café' },
        { id: 4, value: 'Beurre' }]);

    const itemList = list.map(
        (item) => {
            console.log(item);
            return (
                <WhileShoppingItemRow
                    item={item}
                />
            );
        },
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
