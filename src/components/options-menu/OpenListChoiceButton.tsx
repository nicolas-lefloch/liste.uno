import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useOptionsMenu } from './OptionsMenu';

const OpenListChoiceButton = () => {
    const { toggleListChoiceMenu } = useOptionsMenu();
    return (
        <button type="button" className="menu-button" onClick={() => toggleListChoiceMenu(true)}>
            <FontAwesomeIcon icon={faBars} />
        </button>
    );
};

export default OpenListChoiceButton;
