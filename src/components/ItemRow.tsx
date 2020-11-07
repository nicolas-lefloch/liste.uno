import React, { useState } from 'react';
import { Item } from '../datatypes/Item';
import ShoppingListService from '../services/ShoppingList.service';

interface Props {
  item : Item;
  onDelete: () => void;
  editable : boolean;
  onToggleEdition : (editable : boolean) => void;
}

const ItemRow = (props: Props) => {
    const [item, setItem] = useState(props.item);

    const handleKeyPress = (event: any) => {
        if (event.code === 'Enter') {
            props.onToggleEdition(false);
            ShoppingListService.updateItem({
                ...item,
                additionExplanation: null,
                lastUpdate: new Date().getTime(),
            });
        }
    };

    let el;
    if (!props.editable) {
        el = (
            <li className="button-container">
                <div onDoubleClick={() => props.onToggleEdition(true)}>
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
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    type="text"
                    value={item.name}
                />
                <button type="button" className="icon positive" onClick={() => { props.onToggleEdition(false); }}>V</button>

            </li>
        );
    }

    return el;
};

export default ItemRow;
