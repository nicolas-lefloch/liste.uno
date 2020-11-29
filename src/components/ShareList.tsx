import { useParams } from 'react-router-dom';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from '../utilities/SnackBar';
import ListURL from './ListURL';

const ShareList: React.FC = () => {
    const { listID } = useParams<{ listID: string }>();
    const triggerSnackBar = useSnackbar();
    const copyURL = () => {
        navigator.clipboard.writeText(`https://liste.uno/${listID}`).then(() => {
            triggerSnackBar((
                <p>
                    Lien de votre liste copié
                    <br />
                    Partagez-le pour faire vos courses à plusieurs.
                </p>
            ), 3000);
        });
    };
    return (
        <button type="button" className="share-button" onClick={copyURL}>
            <ListURL listID={listID} />
            <FontAwesomeIcon icon={faCopy} width="3" color="#E8907A" />
        </button>
    );
};
export default ShareList;
