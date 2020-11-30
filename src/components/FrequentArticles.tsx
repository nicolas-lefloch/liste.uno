import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Item } from '../datatypes/Item';
import QuantityComputingService from '../services/QuantityComputing.service';
import { useShoppingList } from '../services/ShoppingList.newservice';
import CategoryIcon from './CategoryIcon';

interface Props {
    onItemOuput: (item: Item) => void;
    itemsAlreadyInList: Item[];
    opened: boolean;
}
const FrequentArticles: React.FC<Props> = (props: Props) => {
    const [displayedArticles, setDisplayedArticles] = useState<Item[]>([]);
    const [maxArticles, setMaxArticles] = useState(10);
    const { frequentArticles } = useShoppingList();
    const [showSeeMore, setShowSeeMore] = useState(true);

    const getFrequentArticles = (max: number, excludeItems: Item[]) => {
        const withoutExcluded = frequentArticles.filter((item) => excludeItems.find(
            (i) => QuantityComputingService.itemNameWithoutQuantity(i) === item.name,
        ) === undefined);
        return withoutExcluded.slice(0, max);
    };

    useEffect(() => {
        if (props.opened) {
            const toDisplay = getFrequentArticles(maxArticles, props.itemsAlreadyInList);
            console.log('maximum : ', maxArticles, 'found : ', toDisplay.length);
            setShowSeeMore(toDisplay.length === maxArticles);
            setDisplayedArticles(toDisplay);
        }
    }, [props.itemsAlreadyInList, maxArticles, props.opened]);

    useEffect(() => setMaxArticles(10), [props.opened]);

    return props.opened ? (
        <>
            <ol>
                {displayedArticles.map((item) => (
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
            {
                !displayedArticles.length
                && (
                    <p className="frequent-article-tip">
                        Vos articles préférés seront affichés ici après votre première course
                    </p>
                )
            }
            <button
                className="see-more list-action-button"
                style={{ visibility: showSeeMore ? 'visible' : 'hidden' }}
                type="button"
                onClick={() => setMaxArticles(maxArticles + 10)}
            >
                Voir plus
            </button>
        </>
    ) : null;
};

export default FrequentArticles;
