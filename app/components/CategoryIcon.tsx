import React from 'react';
import type { Category } from '../datatypes/Category';
import CategorizationService from '../services/CategorizationService';
import UnknownIcon from '../ressources/svg/unknown-icon.svg?react';

interface Props {
    onClick?: () => void;
    category?: Category;
    size?: number;
}
const CategoryIcon: React.FC<Props> = ({ onClick = () => { }, category, size = 40 }: Props) => {
    const getCategoryImage = () => {
        if (category) {
            const matchingCategory = CategorizationService.getCategoryImage(category);
            if (matchingCategory) {
                const CategoryImage = matchingCategory.image;
                return (<CategoryImage width={size} height={size} />);
            }
        }
        return <UnknownIcon width={size} height={size} />;
    };
    return (
        <button
            type="button"
            className="category-icon"
            title={category != null ? category.name : ''}
            onClick={onClick}
        >
            {getCategoryImage()}

        </button>

    );
};


export default CategoryIcon;
