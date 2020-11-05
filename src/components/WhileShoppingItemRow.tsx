import React from 'react';
import { Item } from '../datatypes/Item';

interface Props {
    item: Item,
}

const WhileShoppingItemRow = (props: Props) => (
    <li>
        <button type="button" className="item-container full">
            <input type="checkbox" id={String(props.item.id)} name={props.item.value} value={props.item.value} />
            <label
                htmlFor={String(props.item.id)}
                data-content={props.item.value}
            >
                {props.item.value}
            </label>
        </button>
    </li>
);
export default WhileShoppingItemRow;
