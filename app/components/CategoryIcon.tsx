import React from 'react';
import type { Category } from '../datatypes/Category';
import CategorizationService from '../services/CategorizationService';
import UnknownIcon from '../ressources/svg/unknown-icon.svg?react';

interface Props{
    onClick? : () => void;
    category? : Category;
    size?: number;
}
const CategoryIcon : React.FC<Props> = (props : Props) => {
    const getCategoryImage = () => {
        if (props.category) {
            const matchingCategory = CategorizationService.getCategoryImage(props.category);
            if (matchingCategory) {
                const CategoryImage = matchingCategory.image;
                return (<CategoryImage width={props.size} height={props.size} />);
            }
        }
        return <UnknownIcon width={props.size} height={props.size} />;
    };
    return (
        <button
            type="button"
            className="category-icon"
            title={props.category != null ? props.category.name : ''}
            onClick={props.onClick}
        >
            {getCategoryImage()}

        </button>

    );
};
CategoryIcon.defaultProps = {
    onClick: () => {},
    size: 40,
};

export default CategoryIcon;
