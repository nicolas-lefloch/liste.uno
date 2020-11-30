import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import LocalStorageInterface from '../services/LocalStorageInterface';
import ListURL from './ListURL';
import EditableItem from './EditableItem';
import ListIndexService from '../services/ListIndex.service';

const ListChoice: React.FC = () => {
    const lists = LocalStorageInterface.getLists();
    const [localLists, setLocalLists] = useState(lists);
    const [activeListId, setActiveListId] = useState(LocalStorageInterface.getCurrentListId());

    const urlListID = (useParams<{ listID: string }>()).listID;

    useEffect(() => {
        Object.keys(localLists).forEach((key) => {
            ListIndexService.getListName(key).then((listName) => {
                localLists[key] = { id: key, name: listName, items: [] };
                setLocalLists(localLists);
            });
        });
    }, [urlListID]);

    useEffect(() => {
        ListIndexService.getListName(urlListID).then((listName) => {
            localLists[urlListID] = { id: urlListID, name: listName, items: [] };
            setLocalLists(localLists);
        });
    }, [urlListID]);

    const listJsx = Object.values(localLists).map((list) => (
        <li key={list.id}>
            <EditableItem
                submitTextEdition={
                    (value) => { ListIndexService.setListName(list.id, value); }
                }
                text={list.name}
                current={activeListId === list.id}
            />
            <Link to={`/${list.id}/`} onClick={() => setActiveListId(list.id)}>
                <ListURL listID={list.id} />
            </Link>
            { activeListId !== list.id ? (
                <button
                    type="button"
                    onClick={() => {
                        const shoppingLists = LocalStorageInterface.removeList(list.id);
                        setLocalLists(shoppingLists);
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
            ) : <i> </i> }
        </li>
    ));

    return (
        <nav role="navigation" id="list-choice">
            <ul>
                { listJsx }
            </ul>
        </nav>
    );
};

export default ListChoice;
