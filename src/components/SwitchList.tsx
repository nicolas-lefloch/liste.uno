import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ShoppingService from '../services/ShoppingList.service';

const SwitchList : React.FC = () => {
    const localListMap = ShoppingService.getListMap();
    // const [list, setList] = useState<Map<string, Item[]>>(localListMap);

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
        <div>
            <ul>
                { listJsx }
            </ul>
        </div>
    );
};

export default SwitchList;
