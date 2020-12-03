import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LocalStorageInterface from '../services/LocalStorageInterface';
import ListURL from './ListURL';
import EditableItem from './EditableItem';
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

    const listJsx = Object.values(localLists).map((list) => (
        <li key={list.id}>
            <EditableItem
                submitTextEdition={
                    (value) => { ListIndexService.setListName(list.id, value); }
                }
                editMode={beingEditedListId === list.id}
                toggleEditMode={(editMode) => (editMode ? setBeingEditedListID(list.id) : setBeingEditedListID(''))}
                text={list.name}
                current={activeListId === list.id}
            />
            <Link to={`/${list.id}/`} onClick={() => setActiveListId(list.id)}>
                <ListURL listID={list.id} />
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
