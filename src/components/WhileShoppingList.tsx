import React, { useEffect, useState } from 'react';
import { Category } from '../datatypes/Category';
import { Item } from '../datatypes/Item';
import WhileShoppingItemRow from './WhileShoppingItemRow';
import ShoppingListService from '../services/ShoppingList.service';
import CategoryIcon from './CategoryIcon';

const WhileShoppingList = () => {
    const [list, setList] = useState<Item[]>(ShoppingListService.getLocalList());
    useEffect(() => {
        ShoppingListService.getListChangeListener().subscribe(
            (l) => setList(l),
        );
    });
    let categoriesImplied = list.map((i) => i.category).filter((c) => !!c);
    // remove duplications
    categoriesImplied = categoriesImplied.filter(
        (c, index) => categoriesImplied.findIndex(
            (other) => other && other.name === c.name,
        ) === index,
    );
    const someItemsAreUknown = list.find((i) => !i.category);
    if (someItemsAreUknown) {
        categoriesImplied = [...categoriesImplied, undefined];
    }

    const generateItemsOfCategory = (category : Category) => list.filter(
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
        <li key={category ? category.name : 'Inconnue'}>
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
        <div className="while-shopping-list booknote-list">
            <div className="vertical-bar" />
            <ol>
                {categoryList}
            </ol>
        </div>
    );
};

export default WhileShoppingList;
