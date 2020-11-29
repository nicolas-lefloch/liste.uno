import { useParams } from 'react-router-dom';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { useSnackbar } from '../utilities/SnackBar';

interface Props {
    listID : string
}

const ListURL: React.FC<Props> = (props : Props) => (
    <span className="share">
        liste.uno/
        {`${props.listID} `}
    </span>
);
export default ListURL;
