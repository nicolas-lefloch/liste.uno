import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../datatypes/Category';
import CategorizationService from '../services/CategorizationService';

interface Props{
    onClick : () => void;
    category : Category;
    size : number;
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
        return <FontAwesomeIcon icon={faQuestion} style={{ color: 'black', width: props.size, height: props.size }} />;
    };
    return (
        <button
            type="button"
            className="category-icon"
            onClick={props.onClick}
        >
            {getCategoryImage()}

        </button>

    );
};

export default CategoryIcon;
