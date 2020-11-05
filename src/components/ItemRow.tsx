import React, { useState } from 'react';
import { Item } from '../datatypes/Item';
import TransportService from '../services/transport.service';

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
            TransportService.updateItem(item);
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
                    <span className="label">{item.value}</span>
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
                <button type="button" className="icon positive" onClick={() => { setEditable(false); TransportService.updateItem(item); }}>V</button>

            </li>
        );
    }

    return el;
};

export default ItemRow;
