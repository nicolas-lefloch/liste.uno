import React, { useState } from 'react';
import WhileShoppingItemRow from './WhileShoppingItemRow';
import TransportService from '../services/transport.service';

const WhileShoppingList = () => {
    const [list] = useState(TransportService.getList());

    const itemList = list.map(
        (item) => {
            console.log(item);
            return (
                <WhileShoppingItemRow
                    key={item.id}
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
