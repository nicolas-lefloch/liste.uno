import React from 'react';
import { Item } from '../datatypes/Item';

interface Props {
    item: Item,
}

const WhileShoppingItemRow = (props: Props) => (
    <li>
        <button type="button" className="item-container full">
            <input type="checkbox" id={props.item.key} name={props.item.name} value={props.item.name} />
            <label
                htmlFor={String(props.item.key)}
                data-content={props.item.name}
            >
                {props.item.name}
            </label>
        </button>
    </li>
);
export default WhileShoppingItemRow;
