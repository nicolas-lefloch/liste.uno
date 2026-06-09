import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

interface Props {
    text : string
    current : boolean
    submitTextEdition : (value: string) => void;
    editMode : boolean;
    toggleEditMode : (editMode : boolean) => void;
}

const EditableItem = (props: Props) => {
    const [innerText, setInnerText] = useState(props.text);

    const submit = () => {
        props.submitTextEdition(innerText);
        props.toggleEditMode(false);
    };
    return props.editMode ? (
        <form onSubmit={submit}>
            <input
                onChange={(event) => setInnerText(event.target.value)}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                type="text"
                value={innerText}
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
            <div onDoubleClick={() => props.toggleEditMode(true)} className="item-label">
                <p className={props.current ? 'active' : ''}>
                    {innerText}
                </p>
            </div>
        </>
    );
};
export default EditableItem;
