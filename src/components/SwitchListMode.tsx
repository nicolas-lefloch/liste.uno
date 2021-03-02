import { faEdit, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useShoppingList } from '../services/ShoppingList.newservice';

const SwitchListMode = () => {
    const { listID } = useParams<{listID:string}>();
    const path = useLocation().pathname.split('/');

    const isShopping = path.length === 3 && path[2] === 'shopping';
    const { shoppingList } = useShoppingList();
    return (shoppingList.items.length ? (
        <Link to={`/${listID}/${!isShopping ? 'shopping' : 'build-list'}`}>
            <div className={isShopping ? 'switch-mode active' : 'switch-mode'}>
                <span className="slider" />
                <button type="button" className={`small-button ${isShopping ? '' : 'active-mode'}`}>
                    <FontAwesomeIcon icon={faEdit} />
                </button>
                {isShopping ? 'Course' : 'Edition'}
                <button type="button" className={`small-button ${isShopping ? 'active-mode' : ''}`}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>
            </div>
        </Link>
    ) : <></>
    );
};
export default SwitchListMode;
