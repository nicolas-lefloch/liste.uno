import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Item } from '../datatypes/Item';
import { useShoppingList } from '../services/ShoppingList.newservice';
import CategoryIcon from './CategoryIcon';

interface Props{
    onItemOuput : (item : Item) => void;
    itemsAlreadyInList: Item[];
}
const FrequentArticles: React.FC<Props> = (props : Props) => {
    const [frequentArticles, setFrequentArticles] = useState<Item[]>([]);
    const [maxArticles, setMaxArticles] = useState(10);
    const { getFrequentArticles } = useShoppingList();
    useEffect(() => {
        setFrequentArticles(getFrequentArticles(maxArticles, props.itemsAlreadyInList));
    }, [props.itemsAlreadyInList, maxArticles]);

    return (
        <>
            <ol>
                {frequentArticles.map((item) => (
                    <li key={item.name} className="frequent-article">
                        <CategoryIcon category={item.category} />
                        <p>
                            {item.name}
                        </p>
                        <button
                            className="add-item-button"
                            type="button"
                            onClick={() => props.onItemOuput(item)}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </li>
                ))}
            </ol>
            <button
                className="list-action-button"
                style={{ margin: '20px auto' }}
                type="button"
                onClick={() => setMaxArticles(maxArticles + 10)}
            >
                Voir plus
            </button>
        </>
    );
};

export default FrequentArticles;
