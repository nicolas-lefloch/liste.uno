import React from 'react';
import type { Item } from '../datatypes/Item';
import LocationService from '../services/LocationService';
import { useShoppingList } from '../services/ShoppingList.newservice';

interface Props {
    item: Item,
}

const WhileShoppingItemRow = (props: Props) => {
    const { updateItem } = useShoppingList();
    const handleCheck = () => {
        const itemWasJustBought = !props.item.bought;
        const boughtData = itemWasJustBought ? {
            bought: true,
            boughtTime: new Date().getTime(),
            boughtLocation: LocationService.getLocation(),

        } : { bought: false };
        updateItem({
            ...props.item,
            ...boughtData,
        });
    };
    return (
        <li className="while-shopping-row">
            <input
                type="checkbox"
                id={props.item.key}
                name={props.item.name}
                checked={props.item.bought}
                onChange={handleCheck}
            />
            <label
                className="item-label"
                htmlFor={props.item.key}
                data-content={props.item.name}
            >
                {props.item.name}
            </label>
        </li>
    );
};
export default WhileShoppingItemRow;
