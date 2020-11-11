import { useParams } from 'react-router-dom';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const ShareList : React.FC = () => {
    const { listID } = useParams<{listID:string}>();
    const copyURL = () => {
        navigator.clipboard.writeText(`https://liste.uno/${listID}`).then(() => {
            // eslint-disable-next-line no-alert
            alert('je fais le toast');
        });
    };
    return (
        <div>
            <p>
                liste.uno/
                {listID}
            </p>
            <button type="button" className="small-button" onClick={copyURL}>
                <FontAwesomeIcon icon={faCopy} />
            </button>
        </div>
    );
};
export default ShareList;
