import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { useMatch, useNavigate, useParams, useResolvedPath } from 'react-router';
import OptionButtons from './OptionButtons';
import ListChoicePopup from './ListChoicePopup';

interface MenuContextType {
    toggleListChoiceMenu: (open: boolean) => void
}
const MenuContext = React.createContext<MenuContextType>(undefined);

const OptionsMenu: React.FC = () => {
    const listChoiceOpened = !!useMatch('/:listID/build-list/list-choice');
    const { listID } = useParams<{ listID: string }>();
    const navigate = useNavigate();
    const menuContextValue: MenuContextType = {
        toggleListChoiceMenu: (shouldOpen) => {
            if (shouldOpen) {
                navigate(`/${listID}/build-list/list-choice`);
            } else {
                navigate(`/${listID}/build-list`, { replace: true });
            }
        },
    };
    return ReactDOM.createPortal((
        <div id="options-menu-container">
            <div id="options-menu">
                <MenuContext.Provider value={menuContextValue}>
                    <OptionButtons />
                    <ListChoicePopup opened={listChoiceOpened} />
                </MenuContext.Provider>
            </div>
        </div>
    ), document.body);
};
export const useOptionsMenu = () => useContext(MenuContext);
export default OptionsMenu;
