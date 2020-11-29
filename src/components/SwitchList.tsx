import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
import LocalStorageInterface from '../services/LocalStorageInterface';
import ListURL from './ListURL';

const SwitchList : React.FC = () => {
    const localLists = LocalStorageInterface.getLists();
    const [active, setActive] = useState(false);

    const listJsx = Object.values(localLists).map((list) => (
        <li key={list.id}>
            { list.name }
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
        <nav role="navigation" className={`menuToggle small-button ${active ? '' : 'active-mode'}`}>
            <button type="button" className="open-close" onClick={() => setActive(!active)}>
                <FontAwesomeIcon icon={faPlay} size="lg" />
            </button>
            { active
                ? (
                    <ul>
                        { listJsx }
                    </ul>
                )
                : '' }

        </nav>
    );
};

export default SwitchList;
