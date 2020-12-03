import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import ContextualMenu, { Option } from './ContextualMenu';

interface Props{
    options : Option[];
}
const RowOptions : React.FC<Props> = (props : Props) => {
    const [opened, setOpened] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>();
    useEffect(() => {
        if (opened) {
            const closeOptions = (event:MouseEvent) => {
                const clickWasOnButton = buttonRef.current && buttonRef.current.contains(event.target as Node);
                if (!clickWasOnButton) {
                    setOpened(false);
                }
            };
            document.addEventListener('click', closeOptions);
            return () => {
                document.removeEventListener('click', closeOptions);
            };
        }
        return () => {};
    }, [opened]);

    return (
        <div className="row-options-container">
            <div className="row-options-button-container">
                <button
                    ref={buttonRef}
                    className={`row-options-button ${opened ? 'active' : ''}`}
                    type="button"
                    onClick={() => {
                        setOpened(!opened);
                    }}
                >
                    <FontAwesomeIcon icon={faEllipsisV} />
                </button>
            </div>
            <ContextualMenu
                options={props.options}
                opened={opened}
            />

        </div>
    );
};

export default RowOptions;
