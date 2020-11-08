import React, { useState } from 'react';
import {
    faTimes, faSave, faQuestion, faAppleAlt, faBreadSlice, faEgg,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-unresolved
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Item } from '../datatypes/Item';
import ShoppingListService from '../services/ShoppingList.service';
import { Category } from '../datatypes/Category';

interface Props {
    item : Item;
    onDelete: () => void;
    editable : boolean;
    onToggleEdition : (editable : boolean) => void;
}

const ItemRow = (props: Props) => {
    const [item, setItem] = useState(props.item);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    const categories : Category[] = [{ name: 'Fruits et légumes', image: 'apple' }, { name: 'Boulangerie', image: 'bread' }, { name: 'Crèmerie', image: 'egg' }];
    const getCategoryIcon = (category : Category) : IconDefinition => {
        if (category === undefined) {
            return faQuestion;
        }
        switch (category.image) {
            case 'apple':
                return faAppleAlt;
            case 'egg':
                return faEgg;
            case 'bread':
                return faBreadSlice;
            default:
                return faQuestion;
        }
    };
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

    const categoriesList = categories.map((category) => (
        <li>
            <button
                type="button"
                className="category"
                onClick={() => {
                    item.category = category;
                    setItem(item);
                    setShowCategoryMenu(false);
                }}
            >
                <FontAwesomeIcon icon={getCategoryIcon(category)} />
            </button>
        </li>
    ));
    let el;
    if (!props.editable) {
        el = (
            <>
                <li className="button-container">
                    <button type="button" className="category" onClick={() => setShowCategoryMenu(!showCategoryMenu)}>
                        <FontAwesomeIcon icon={getCategoryIcon(item.category)} />
                    </button>
                    <div onDoubleClick={() => props.onToggleEdition(true)}>
                        {item.additionExplanation && (
                            <p className="item-addition-explanation">{item.additionExplanation}</p>
                        )}
                        <span className="label">{item.name}</span>
                    </div>
                    <button type="button" className="circular ui icon button" onClick={props.onDelete}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </li>
                {showCategoryMenu
                && (
                    <div className="category-menu">
                        <ol className="categoryList">
                            {categoriesList}
                        </ol>
                    </div>
                )}
            </>
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
                <button type="button" className="circular ui icon olive button" onClick={() => { props.onToggleEdition(false); }} title="Remove item">
                    <FontAwesomeIcon icon={faSave} />
                </button>

            </li>
        );
    }

    return el;
};

export default ItemRow;
