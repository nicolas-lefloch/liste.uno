import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { Category } from '../datatypes/Category';
import CategorizationService from '../services/CategorizationService';

interface Props{
    onClick : () => void
    category : Category
}
const CategoryIcon : React.FC<Props> = (props : Props) => {
    console.log(props.category);
    const CategoryImage = CategorizationService.getCategoryImage(props.category).image;
    const size = 50;
    return (
        <button
            type="button"
            className="category"
            onClick={props.onClick}
        >
            {
                props.category ? <CategoryImage width={size} height={size} />

                    : <FontAwesomeIcon icon={faQuestion} />
            }

        </button>

    );
};

export default CategoryIcon;
