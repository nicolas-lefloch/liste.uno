import React, { useState } from 'react';
import { Item } from '../datatypes/Item';

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
        }
    };

    let el;
    if (!editable) {
        el = (
            <li className="button-container" onDoubleClick={() => setEditable(!editable)}>
                <div>
                    {item.additionExplanation && (
                        <p className="item-addition-explanation">{item.additionExplanation}</p>
                    )}
                    <p>{item.value}</p>
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
                    onChange={(event) => setItem({ ...item, value: event.target.value })}
                    // autoFocus
                    type="text"
                    value={item.value}
                />
                <button type="button" className="icon positive" onClick={() => setEditable(false)}>V</button>

            </li>
        );
    }

    return el;
};

export default ItemRow;
