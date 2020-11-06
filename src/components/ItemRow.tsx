import React, { useState } from 'react';
import { Item } from '../datatypes/Item';
import ShoppingListService from '../services/ShoppingList.service';

interface Props {
  item : Item;
  onDelete: () => void
}

const ItemRow = (props: Props) => {
    const [item, setItem] = useState(props.item);
    const [editable, setEditable] = useState(false);

    const handleKeyPress = (event: any) => {
        if (event.code === 'Enter') {
            setEditable(false);
            ShoppingListService.updateItem({ ...item, lastUpdate: new Date().getTime() });
        }
    };

    let el;
    if (!editable) {
        el = (
            <li className="button-container" onDoubleClick={() => setEditable(true)}>
                <div>
                    {item.additionExplanation && (
                        <p className="item-addition-explanation">{item.additionExplanation}</p>
                    )}
                    <span className="label">{item.name}</span>
                </div>
                <button type="button" className="icon negative" onClick={props.onDelete}>X</button>
            </li>
        );
    } else {
        el = (
            <li className="button-container">
                <input
                    className="item"
                    onKeyPress={handleKeyPress}
                    onChange={(event) => setItem({ ...item, name: event.target.value })}
                    // autoFocus
                    type="text"
                    value={item.name}
                />
                <button type="button" className="icon positive" onClick={() => { setEditable(false); }}>V</button>

            </li>
        );
    }

    return el;
};

export default ItemRow;
