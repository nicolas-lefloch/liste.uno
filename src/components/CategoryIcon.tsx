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
    console.log(props);
    const size = 50;
    const getCategoryImage = () => {
        if (props.category) {
            const CategoryImage = CategorizationService.getCategoryImage(props.category).image;
            return (<CategoryImage width={size} height={size} />);
        }
        return <FontAwesomeIcon icon={faQuestion} style={{ color: 'black' }} />;
    };
    return (
        <button
            type="button"
            className="category"
            onClick={props.onClick}
        >
            {getCategoryImage()}

        </button>

    );
};

export default CategoryIcon;
