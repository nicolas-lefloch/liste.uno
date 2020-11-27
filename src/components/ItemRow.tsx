import React, { FormEvent, useState } from 'react';
import {
    faTimes, faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Item } from '../datatypes/Item';
import ShoppingListService from '../services/ShoppingList.service';
import CategorizationService from '../services/CategorizationService';
import CategoryIcon from './CategoryIcon';
import { Category } from '../datatypes/Category';
import { useSnackbar } from '../utilities/SnackBar';

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

    const triggerSnackBar = useSnackbar();

    const onCategoryAssigned = (category : Category) => {
        ShoppingListService.updateItem({
            ...props.item,
            lastUpdate: new Date().getTime(),
            category,
        });
        CategorizationService.registerCategoryWasAssigned(
            category,
            props.item,
            ShoppingListService.getCurrentListID(),
        );
        triggerSnackBar(
            <>
                <CategoryIcon
                    size={50}
                    category={category}
                />
                {category.name}
            </>,
            1000,
        );
    };

    /** The list of available categories to assign, shown under the item */
    const categoriesList = CategorizationService.getAppCategories().map((category) => (
        <li key={category.name}>
            <CategoryIcon
                size={40}
                onClick={() => onCategoryAssigned(category)}
                category={category}
            />
        </li>
    ));
    return props.editable
        ? (
            <li>
                <form onSubmit={submitItemNameEdition}>
                    <input
                        onChange={(event) => setInnerItemName(event.target.value)}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        type="text"
                        value={innerItemName}
                    />
                    <button
                        type="submit"
                        className="small-button"
                        title="Remove item"
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </form>

            </li>
        )
        : (
            <>
                <li>
                    <div>
                        <CategoryIcon
                            category={props.item.category}
                            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                            size={40}
                        />
                        <div onDoubleClick={() => props.onToggleEdition(true)} className="item-label">
                            <p>
                                {props.item.name}
                            </p>
                            {props.item.additionExplanation && (
                                <p className="item-addition-explanation">{props.item.additionExplanation}</p>
                            )}
                        </div>
                        <div className="delete-button-container">
                            <button className="small-button" type="button" onClick={props.onDelete}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>
                    {showCategoryMenu && (
                        <ol className="category-choice-menu">
                            {categoriesList}
                        </ol>
                    )}
                </li>
            </>
        );
};

export default ItemRow;
