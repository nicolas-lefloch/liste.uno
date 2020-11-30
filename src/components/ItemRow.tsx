import React, { FormEvent, useState } from 'react';
import {
    faSave, faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Item } from '../datatypes/Item';
import CategorizationService from '../services/CategorizationService';
import CategoryIcon from './CategoryIcon';
import { Category } from '../datatypes/Category';
import { useSnackbar } from '../utilities/SnackBar';
import { useShoppingList } from '../services/ShoppingList.newservice';
import ItemRowOptions from './ItemRowOptions';

interface Props {
    item: Item;
    onDelete: () => void;
    editable: boolean;
    onToggleEdition: (editable: boolean) => void;
}

const ItemRow = (props: Props) => {
    const { updateItem, shoppingList } = useShoppingList();

    /** Current state of the input name */
    const [innerItemName, setInnerItemName] = useState(props.item.name);

    /** Wether the categories menu should be shown or not */
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    const [showOptionButtons, setShowOptionButtons] = useState(false);

    /** Calls the service to update the item when the name form is submitted */
    const submitItemNameEdition = (event: FormEvent) => {
        event.preventDefault();
        props.onToggleEdition(false);
        updateItem({
            ...props.item,
            name: innerItemName,
            additionExplanation: null,
            lastUpdate: new Date().getTime(),
        });
    };

    const triggerSnackBar = useSnackbar();

    const onCategoryAssigned = (category: Category) => {
        updateItem({
            ...props.item,
            lastUpdate: new Date().getTime(),
            category,
        });
        CategorizationService.registerCategoryWasAssigned(
            category,
            props.item,
            shoppingList.id,
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
    return (
        <li>
            <div>
                <CategoryIcon
                    category={props.item.category}
                    onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                    size={40}
                />
                {props.editable
                    ? (
                        <form onSubmit={submitItemNameEdition}>
                            <input
                                onChange={(event) => setInnerItemName(event.target.value)}
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                type="text"
                                value={innerItemName}
                                size={1}
                            />
                            <button
                                type="submit"
                                className="small-button"
                                title="Save"
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </button>
                        </form>

                    )
                    : (
                        <>
                            <div onDoubleClick={() => props.onToggleEdition(true)} className="item-label">
                                <p>
                                    {props.item.name}
                                </p>
                                {props.item.additionExplanation && (
                                    <p className="item-addition-explanation">{props.item.additionExplanation}</p>
                                )}
                            </div>
                            <div className="delete-button-container">
                                <button className="small-button" type="button" onClick={() => setShowOptionButtons(true)}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                            </div>
                            <ItemRowOptions
                                onDelete={props.onDelete}
                                onEdit={() => props.onToggleEdition(true)}
                                onEditCategory={() => setShowCategoryMenu(true)}
                                onCloseOptions={() => setShowOptionButtons(false)}
                                opened={showOptionButtons}
                            />
                        </>
                    )}
            </div>
            {showCategoryMenu && (
                <ol className="category-choice-menu">
                    {categoriesList}
                </ol>
            )}
        </li>
    );
};

export default ItemRow;
