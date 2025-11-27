import React from 'react';
import type { Category } from '../datatypes/Category';
import WhileShoppingItemRow from './WhileShoppingItemRow';
import CategoryIcon from './CategoryIcon';
import { useShoppingList } from '../services/ShoppingList.newservice';

const WhileShoppingList: React.FC = () => {
    const { shoppingList } = useShoppingList();
    let categoriesImplied = shoppingList.items.map((i) => i.category).filter((c) => !!c);

    categoriesImplied = categoriesImplied.filter(
        (c, index) => categoriesImplied.findIndex(
            (other) => other && other.name === c.name,
        ) === index,
    );
    const someItemsAreUknown = shoppingList.items.find((i) => !i.category);
    if (someItemsAreUknown) {
        categoriesImplied = [...categoriesImplied, undefined];
    }

    const generateItemsOfCategory = (category: Category) => shoppingList.items.filter(
        (item) => (category
            ? (item.category && item.category.name === category.name) : !item.category),
    ).map(
        (item) => (
            <WhileShoppingItemRow
                key={item.key + item.lastUpdate}
                item={item}
            />
        ),
    );

    const categoryList = categoriesImplied.map((category) => (
        <li key={category ? category.name : 'Inconnue'} className="category-listing">
            <div className="category-label">
                <CategoryIcon category={category} />
                <p>{category?.name || 'Inconnue'}</p>
            </div>
            <ol>
                {generateItemsOfCategory(category)}
            </ol>
        </li>
    ));

    return (
        <>
            <div className="while-shopping-list booknote-list">
                <div className="vertical-bar" />
                <ol>
                    {categoryList}
                </ol>
            </div>
        </>
    );
};

export default WhileShoppingList;
