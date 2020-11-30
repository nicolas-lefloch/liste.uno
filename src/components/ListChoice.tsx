import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import LocalStorageInterface from '../services/LocalStorageInterface';
import ListURL from './ListURL';

const ListChoice: React.FC = () => {
    const localLists = LocalStorageInterface.getLists();

    const listJsx = Object.values(localLists).map((list) => (
        <li key={list.id}>
            { list.name}
            {' '}
            <Link to={`/${list.id}/`}>
                <ListURL listID={list.id} />
            </Link>
            <button type="button">
                <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
        </li>
    ));

    return (
        <nav role="navigation" id="list-choice">
            <ul>
                {listJsx}
            </ul>

        </nav>
    );
};

export default ListChoice;
