import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import LocalStorageInterface from '../services/LocalStorageInterface';

const SwitchList : React.FC = () => {
    const localLists = LocalStorageInterface.getLists();
    // const [list, setList] = useState<Map<string, Item[]>>(localListMap);
    const [active, setActive] = useState(false);

    const listJsx = Object.values(localLists).map((list) => (
        <li key={list.id}>
            { list.name }
            {' '}
            <Link to={`/${list.id}/`}>
                liste.uno/
                {list.id}
            </Link>
        </li>
    ));

    return (
        <nav role="navigation" className={`menuToggle small-button ${active ? '' : 'active-mode'}`}>
            <button type="button" onClick={() => setActive(!active)}>
                <FontAwesomeIcon icon={faPlay} size="lg" />
            </button>

            <ul>
                { listJsx }
            </ul>

        </nav>
    );
};

export default SwitchList;
