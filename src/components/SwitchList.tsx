import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import ShoppingService from '../services/ShoppingList.service';

const SwitchList : React.FC = () => {
    const localListMap = ShoppingService.getListMap();
    // const [list, setList] = useState<Map<string, Item[]>>(localListMap);
    const [active, setActive] = useState(false);

    const listJsx = Object.values(localListMap).map((v) => (
        <li key={v.id}>
            { v.id }
            {' '}
            <Link to={`/${v.id}/`}>
                liste.uno/
                {v.id}
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
