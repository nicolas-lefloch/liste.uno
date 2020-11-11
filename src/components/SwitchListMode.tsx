import { faEdit, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const SwitchListMode = () => {
    const { listID } = useParams<{listID:string}>();
    const path = useLocation().pathname.split('/');

    const isShopping = path.length === 3 && path[2] === 'shopping';
    return (
        <div>
            <Link to={`/${listID}/shopping`}>
                <button type="button" className="small-button">
                    <FontAwesomeIcon icon={faShoppingCart} color={isShopping ? 'red' : 'gray'} />
                </button>
            </Link>
            <Link to={`/${listID}`}>
                <button type="button" className="small-button">
                    <FontAwesomeIcon icon={faEdit} color={isShopping ? 'gray' : 'red'} />
                </button>
            </Link>
        </div>
    );
};
export default SwitchListMode;
