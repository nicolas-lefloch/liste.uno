import React, { type FormEvent, useState } from 'react';
import {
    faSave,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Item } from '../datatypes/Item';
import CategorizationService from '../services/CategorizationService';
import CategoryIcon from './CategoryIcon';
import type { Category } from '../datatypes/Category';
import { useSnackbar } from '../utilities/SnackBar';
import { useShoppingList } from '../services/ShoppingList.newservice';
import RowOptions from './RowOptions';

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

    /** Calls the service to update the item when the name form is submitted */
    const submitItemNameEdition = (event: FormEvent) => {
        event.preventDefault();
        props.onToggleEdition(false);
        updateItem({
            ...props.item,
            name: innerItemName,
            additionExplanation: undefined,
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
                                onBlur={() => props.onToggleEdition(false)}
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
                            <div
                                onDoubleClick={() => props.onToggleEdition(true)}
                                className={`item-label ${props.item.bought ? 'bought' : ''}`}
                            >
                                <p>
                                    {props.item.name}
                                </p>
                                {props.item.additionExplanation && (
                                    <p className="item-addition-explanation">{props.item.additionExplanation}</p>
                                )}
                            </div>
                            <RowOptions options={[
                                {
                                    label: 'Supprimer',
                                    action: props.onDelete,
                                },
                                {
                                    label: 'Modifier',
                                    action: () => props.onToggleEdition(true),
                                },
                                {
                                    label: 'Catégorie',
                                    action: () => setShowCategoryMenu(true),
                                },
                            ]}
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
