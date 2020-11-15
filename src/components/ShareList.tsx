import { useParams } from 'react-router-dom';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from '../utilities/SnackBar';

const ShareList : React.FC = () => {
    const { listID } = useParams<{listID:string}>();
    const triggerSnackBar = useSnackbar();
    const copyURL = () => {
        navigator.clipboard.writeText(`https://liste.uno/${listID}`).then(() => {
            triggerSnackBar('Lien copié, partagez-le à vos partenaires de courses', 3000);
        });
    };
    return (
        <button type="button" className="share" onClick={copyURL}>
            <p>
                liste.uno/
                {`${listID} `}
                <FontAwesomeIcon icon={faCopy} width="3" color="#E8907A" />
            </p>
        </button>
    );
};
export default ShareList;
