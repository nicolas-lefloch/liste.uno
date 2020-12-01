import React from 'react';

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
