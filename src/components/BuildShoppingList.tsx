import React, { useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';
import CategorizationService from '../services/CategorizationService';
import SuggestInstallService from '../services/SuggestInstall.service';
import { useShoppingList } from '../services/ShoppingList.newservice';
/**
 * Main view of app
 * Edition of a shopping list
 * @constructor
 */
const BuildShoppingList : React.FC = () => {
    const {
        shoppingList, addItem, updateItem, removeItem,
    } = useShoppingList();
    const [editedItemKey, setEditedItemKey] = useState<string>();
    /**
     * Add items to list when they are pushed by ItemInput component
     * @param newItems item list
     */
    const addItemsToList = (newItems : Item[]) => {
        newItems.forEach(
            (item) => {
                // serialization
                const itemWithKey = addItem(item);
                if (!itemWithKey.category) {
                // get preferred category when item has no category
                    CategorizationService
                        .getPreferredCategory(itemWithKey, shoppingList.id)
                        .then((category) => {
                            if (category) {
                                updateItem({ ...itemWithKey, category });
                            }
                        });
                }
            },
        );
        SuggestInstallService.registerInteractionWasMade();
    };

    const deleteAllItems = () => {
        shoppingList.items.forEach(
            (item) => removeItem(item.key),
        );
    };
    const itemList = shoppingList.items.map(
        (item) => (
            <ItemRow
                key={item.key + item.lastUpdate}
                item={item}
                editable={editedItemKey === item.key}
                onToggleEdition={
                    (shouldEdit) => setEditedItemKey(shouldEdit ? item.key : undefined)
                }
                onDelete={() => removeItem(item.key)}
            />
        ),
    );

    itemList.reverse();

    return (
        <>
            <ItemInput onItemsOutput={addItemsToList} />
            <div className="editable-shopping-list booknote-list">
                <div className="vertical-bar" />
                <ol>
                    {itemList.length ? itemList
                        : <span className="empty-list"> Liste vide. Que voulez-vous acheter ?</span>}
                </ol>
            </div>
            {
                !!itemList.length
            && (
                <button className="remove-all" type="button" onClick={deleteAllItems}>
                    Vider la liste
                    <div className="icon-circle"><FontAwesomeIcon icon={faTrash} color="white" /></div>
                </button>
            )
            }
        </>
    );
};

export default BuildShoppingList;
