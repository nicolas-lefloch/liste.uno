import React, { useEffect } from 'react';

interface Props {
    onDelete: () => void;
    onEdit: () => void;
    onEditCategory: () => void;
    opened : boolean;
    onCloseOptions : () => void;
}
const ItemRowOptions: React.FC<Props> = (props: Props) => {
    useEffect(() => {
        if (props.opened) {
            document.addEventListener('click', props.onCloseOptions);
        }
        return () => {
            document.removeEventListener('click', props.onCloseOptions);
        };
    }, [props.opened]);
    return (
        <div className={`item-row-options ${props.opened ? 'opened' : ''}`}>
            <button type="button" onClick={props.onDelete}>Supprimer</button>
            <button type="button" onClick={props.onEdit}>Modifier</button>
            <button type="button" onClick={props.onEditCategory}>Catégorie</button>
        </div>
    );
};

export default ItemRowOptions;
