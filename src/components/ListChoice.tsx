import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import LocalStorageInterface from '../services/LocalStorageInterface';
import ListIndexService from '../services/ListIndex.service';
import RowOptions from './RowOptions';
import { useSnackbar } from '../utilities/SnackBar';

const ListChoice: React.FC = () => {
    const lists = LocalStorageInterface.getLists();
    const [localLists, setLocalLists] = useState(lists);
    const [activeListId, setActiveListId] = useState(LocalStorageInterface.getCurrentListId());

    const urlListID = (useParams<{ listID: string }>()).listID;

    const [beingEditedListId, setBeingEditedListID] = useState('');

    const triggerSnackBar = useSnackbar();

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

    const removeList = (listID : string) => {
        const shoppingLists = LocalStorageInterface.removeList(listID);
        setLocalLists(shoppingLists);
    };

    const handleListRename = (event : FormEvent) => {
        event.preventDefault();
        ListIndexService.setListName(beingEditedListId, (event.target[0] as HTMLInputElement).value);
        setLocalLists(LocalStorageInterface.getLists());
        setBeingEditedListID('');
    };

    const handleListImport = (event : FormEvent) => {
        event.preventDefault();
        const inputValue = (event.target[0] as HTMLInputElement).value;
        if (inputValue !== undefined && inputValue.length > 0) {
            const splitInput = inputValue.split('/');
            window.location.href = `/${splitInput[splitInput.length - 1]}`;
        }
    };

    const newList = () => {
        window.location.href = `/${LocalStorageInterface.generateRandomId()}`;
    };

    const listJsx = Object.values(localLists).map((list) => (
        <li key={list.id}>
            {
                beingEditedListId === list.id ? (
                    <form onSubmit={handleListRename} className="f-grow flex f-vcenter">
                        <input
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                            className="f-grow list-name"
                            type="text"
                            defaultValue={list.name}
                        />
                        <button
                            type="submit"
                            className="small-button"
                            title="Save item"
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </form>
                ) : (
                    <>
                        <Link to={`/${list.id}/`} onClick={() => setActiveListId(list.id)} className="f-grow">
                            <div className="list-label item-label">
                                <p className={activeListId === list.id ? 'active' : ''}>
                                    {list.name}
                                </p>
                            </div>
                        </Link>
                        <RowOptions
                            options={[
                                {
                                    label: 'Supprimer',
                                    action: () => removeList(list.id),
                                    disabled: activeListId === list.id,
                                },
                                {
                                    label: 'Renommer',
                                    action: () => setBeingEditedListID(list.id),
                                },
                                {
                                    label: 'Partager',
                                    action: () => {
                                        navigator.clipboard.writeText(`https://liste.uno/${list.id}`).then(() => {
                                            triggerSnackBar((
                                                <p>
                                                    Lien de votre liste copié
                                                    <br />
                                                    Partagez-le pour faire vos courses à plusieurs.
                                                </p>
                                            ), 3000);
                                        });
                                    },
                                },
                            ]}
                        />
                    </>
                )
            }
        </li>
    ));

    return (
        <nav role="navigation" id="list-choice">
            <ul>
                {listJsx}
            </ul>
            <div className="flex popin-action-btn">
                <button className="list-action-button" type="button" onClick={newList}>
                    Nouvelle liste
                    <div className="icon-circle">
                        <FontAwesomeIcon icon={faPlus} color="white" />
                    </div>
                </button>
                <form onSubmit={handleListImport} className="import-list-form">
                    <span>Import</span>
                    <input type="text" placeholder=" liste.uno/xxxx" />
                    <button type="submit">
                        <div className="icon-circle">
                            <FontAwesomeIcon icon={faSignOutAlt} color="white" />
                        </div>
                    </button>
                </form>

            </div>
        </nav>
    );
};

export default ListChoice;
