import React from 'react';
import { Item } from '../datatypes/Item';
import LocationService from '../services/LocationService';
import ShoppingService from '../services/ShoppingList.service';

interface Props {
    item: Item,
}

const WhileShoppingItemRow = (props: Props) => {
    const handleCheck = () => {
        const itemWasJustBought = !props.item.bought;
        const boughtData = itemWasJustBought ? {
            bought: true,
            boughtTime: new Date().getTime(),
            boughtLocation: LocationService.getLocation(),

        } : { bought: false };
        ShoppingService.updateItem({
            ...props.item,
            ...boughtData,
        });
    };
    return (
        <li>
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
