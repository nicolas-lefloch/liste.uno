import { faEdit, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const SwitchListMode = () => {
    const { listID } = useParams<{listID:string}>();
    const path = useLocation().pathname.split('/');

    const isShopping = path.length === 3 && path[2] === 'shopping';
    return (
        <Link to={`/${listID}/${!isShopping ? 'shopping' : ''}`}>
            <div className={!isShopping ? 'switch-mode active' : 'switch-mode'}>
                <span className="slider round" />
                <button type="button" className="small-button">
                    <FontAwesomeIcon icon={faShoppingCart} color={isShopping ? 'white' : '#707070'} />
                </button>
                {isShopping ? 'Course' : 'Edition'}
                <button type="button" className="small-button">
                    <FontAwesomeIcon icon={faEdit} color={isShopping ? '#707070' : 'white'} />
                </button>
            </div>
        </Link>
    );
};
export default SwitchListMode;
