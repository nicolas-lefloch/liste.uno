import React, { useEffect, useState } from 'react';
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
import { ReactComponent as EmptyListImg } from '../ressources/svg/empty_cart.svg';
import VoiceRecorderService from '../services/voice-recorder.service';

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
                        }).catch((error) => {
                            console.error('Could not categorize ', itemWithKey.name);
                            console.error(error);
                        });
                }
            },
        );
        SuggestInstallService.registerInteractionWasMade();
    };

    // Handle items from siri
    useEffect(() => {
        const itemsFromSiri = shoppingList.items.filter((item) => item.fromSiri);
        console.log('Items from siri : ', itemsFromSiri);
        // All items from siri will have to be split and categorized as if they were voice added directly from liste.uno
        itemsFromSiri.forEach((item) => {
            const generatedItems = VoiceRecorderService.transcriptToItems(item.name);
            removeItem(item.key);
            addItemsToList(generatedItems);
        });
    }, [shoppingList]);

    const deleteAllItems = () => {
        shoppingList.items.forEach(
            (item) => item.bought && removeItem(item.key),
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
                        : (
                            <div>
                                <span className="empty-list"> Liste vide. Que voulez-vous acheter ?</span>
                                <EmptyListImg />
                            </div>
                        )}
                </ol>
            </div>
            <div className="list-actions">
                {
                    !!shoppingList.items.filter((i) => i.bought).length
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
                                : 'Supprimer les éléments barrés'}
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
