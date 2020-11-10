import React, { FormEvent, useState } from 'react';
import {
    faTimes, faSave, faQuestion, faAppleAlt, faBreadSlice, faEgg,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-unresolved
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { Item } from '../datatypes/Item';
import ShoppingListService from '../services/ShoppingList.service';
import { Category } from '../datatypes/Category';
import CategorizationService from '../services/CategorizationService';

interface Props {
    item : Item;
    onDelete: () => void;
    editable : boolean;
    onToggleEdition : (editable : boolean) => void;
}

const ItemRow = (props: Props) => {
    /** Current state of the input name */
    const [innerItemName, setInnerItemName] = useState(props.item.name);

    /** Wether the categories menu should be shown or not */
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

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

    /** Calls the service to update the item when the name form is submitted */
    const submitItemNameEdition = (event:FormEvent) => {
        event.preventDefault();
        props.onToggleEdition(false);
        ShoppingListService.updateItem({
            ...props.item,
            name: innerItemName,
            additionExplanation: null,
            lastUpdate: new Date().getTime(),
        });
    };

    /** The list of available categories to assign, shown under the item */
    const categoriesList = CategorizationService.appCategories.map((category) => (
        <li key={category.name}>
            <button
                type="button"
                className="category"
                onClick={() => {
                    ShoppingListService.updateItem({
                        ...props.item,
                        lastUpdate: new Date().getTime(),
                        category,
                    });
                    CategorizationService.registerCategoryWasAssigned(
                        category,
                        props.item,
                        ShoppingListService.getDefaultListID(),
                    );
                }}
            >
                <FontAwesomeIcon icon={getCategoryIcon(category)} />
            </button>
        </li>
    ));
    return props.editable
        ? (
            <li className="button-container">
                <form onSubmit={submitItemNameEdition} target="">
                    <input
                        className="item"
                        onChange={(event) => setInnerItemName(event.target.value)}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        type="text"
                        value={innerItemName}
                    />
                    <button
                        type="submit"
                        className="circular ui icon olive button"
                        title="Remove item"
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </form>

            </li>
        )
        : (
            <>
                <li className="button-container">
                    <button type="button" className="category" onClick={() => setShowCategoryMenu(!showCategoryMenu)}>
                        <FontAwesomeIcon icon={getCategoryIcon(props.item.category)} />
                    </button>
                    <div onDoubleClick={() => props.onToggleEdition(true)} className="label">
                        {props.item.additionExplanation && (
                            <p className="item-addition-explanation">{props.item.additionExplanation}</p>
                        )}
                        <span className="label">{props.item.name}</span>
                    </div>
                    <button type="button" className="circular icon small button" onClick={props.onDelete}>
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
};

export default ItemRow;
