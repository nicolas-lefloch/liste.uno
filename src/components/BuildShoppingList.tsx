import React, { useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ShoppingListService from '../services/ShoppingList.service';
import { Item } from '../datatypes/Item';
import ItemInput from './ItemInput';
import ItemRow from './ItemRow';
import FrequentArticles from './FrequentArticles';
import CategorizationService from '../services/CategorizationService';
import SuggestInstallService from '../services/SuggestInstall.service';

/**
 * Main view of app
 * Edition of a shopping list
 * @constructor
 */
const BuildShoppingList = () => {
    const [list, setList] = useState<Item[]>(ShoppingListService.getLocalList());
    const [editedItemKey, setEditedItemKey] = useState<string>();
    const [showingReally, setShowingReally] = useState(false);
    const [showFrequentArticles, setShowFrequentArticles] = useState(false);
    useEffect(() => {
        ShoppingListService.getListChangeListener().subscribe(
            (l) => {
                setList(l);
            },
        );
    }, []);

    /**
     * Add items to list when they are pushed by ItemInput component
     * @param newItems item list
     */
    const addItemsToList = (newItems : Item[]) => {
        newItems.forEach(
            (item) => {
                const itemWithKey = ShoppingListService.addItem(item);
                if (!itemWithKey.category) {
                // get preferred category when item has no category
                    CategorizationService
                        .getPreferredCategory(itemWithKey, ShoppingListService.getDefaultListID())
                        .then((category) => {
                            if (category) {
                                // serialization
                                ShoppingListService.updateItem({ ...itemWithKey, category });
                            }
                        });
                }
            },
        );
        setList(ShoppingListService.getLocalList());
        SuggestInstallService.registerInteractionWasMade();
    };

    const deleteItem = (key) => {
        const newList = list.filter((e) => e.key !== key);
        setList(newList);
        ShoppingListService.removeItem(key);
    };

    const deleteAllItems = () => {
        list.forEach(
            (item) => deleteItem(item.key),
        );
        setShowingReally(false);
    };
    const itemList = list.map(
        (item) => (
            <ItemRow
                key={item.key + item.lastUpdate}
                item={item}
                editable={editedItemKey === item.key}
                onToggleEdition={
                    (shouldEdit) => setEditedItemKey(shouldEdit ? item.key : undefined)
                }
                onDelete={() => deleteItem(item.key)}
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
            {
                showFrequentArticles
                && (
                    <FrequentArticles
                        onItemOuput={(item) => addItemsToList([item])}
                        itemsAlreadyInList={list}
                    />
                )
            }
        </>
    );
};

export default BuildShoppingList;
