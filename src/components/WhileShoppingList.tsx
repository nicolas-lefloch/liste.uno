import React, { useEffect, useState } from 'react';
import { Item } from '../datatypes/Item';
import WhileShoppingItemRow from './WhileShoppingItemRow';
import ShoppingListService from '../services/ShoppingList.service';

const WhileShoppingList = () => {
    const [list, setList] = useState<Item[]>(ShoppingListService.getLocalList());
    useEffect(() => {
        ShoppingListService.getListChangeListener().subscribe(
            (l) => setList(l),
        );
    });
    const itemList = list.map(
        (item) => (
            <WhileShoppingItemRow
                key={item.key + item.lastUpdate}
                item={item}
            />
        ),
    );
    itemList.reverse();

    return (
        <div className="while-shopping-list booknote-list">
            <div className="vertical-bar" />
            <ol>
                {itemList}
            </ol>
        </div>
    );
};

export default WhileShoppingList;
