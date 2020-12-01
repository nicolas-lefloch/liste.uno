import React, { useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useParams } from 'react-router-dom';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';
import FrequentArticles from './FrequentArticles';
import CategorizationService from '../services/CategorizationService';
import SuggestInstallService from '../services/SuggestInstall.service';
import { useShoppingList } from '../services/ShoppingList.newservice';
/**
 * Main view of app
 * Edition of a shopping list
 * @constructor
 */
const BuildShoppingList: React.FC = () => {
    const {
        shoppingList, addItem, updateItem, removeItem,
    } = useShoppingList();

    const { editedItemKey, listID } = useParams<{editedItemKey:string, listID:string}>();
    const history = useHistory();
    const toggleEdition = (startEdition:boolean, itemKey:string) => {
        if (startEdition) {
            const path = `/${listID}/build-list/edit-item/${itemKey}`;
            if (editedItemKey) {
                history.replace(path);
            } else {
                history.push(path);
            }
        } else {
            history.goBack();
        }
    };
    const [showingReally, setShowingReally] = useState(false);
    const [showFrequentArticles, setShowFrequentArticles] = useState(false);
    /**
     * Add items to list when they are pushed by ItemInput component
     * @param newItems item list
     */
    const addItemsToList = (newItems: Item[]) => {
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
        setShowingReally(false);
    };
    const itemList = shoppingList.items.map(
        (item) => (
            <ItemRow
                key={item.key + item.lastUpdate}
                item={item}
                editable={editedItemKey === item.key}
                onToggleEdition={
                    (shouldEdit) => toggleEdition(shouldEdit, item.key)
                }
                onDelete={() => removeItem(item.key)}
            />
        ),
    );

    const toggleFrequentArticles = () => {
        setShowFrequentArticles(!showFrequentArticles);
    };

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
            <div className="list-actions">
                {
                    !!itemList.length
                    && (
                        <button
                            className={`list-action-button ${showingReally ? 'really' : ''}`}
                            type="button"
                            onClick={() => (showingReally
                                ? deleteAllItems() : setShowingReally(true))}
                            onBlur={() => setShowingReally(false)}
                        >
                            {showingReally
                                ? 'Vraiment ?'
                                : 'Vider la liste'}
                            <div className="icon-circle"><FontAwesomeIcon icon={faTrash} color="white" /></div>
                        </button>
                    )
                }
                <button className="list-action-button" type="button" onClick={toggleFrequentArticles}>
                    Articles Fréquents
                </button>

            </div>
            <FrequentArticles
                onItemOuput={(item) => addItemsToList([item])}
                itemsAlreadyInList={shoppingList.items}
                opened={showFrequentArticles}
            />
        </>
    );
};

export default BuildShoppingList;
