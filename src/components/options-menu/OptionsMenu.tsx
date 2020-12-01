import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import OptionButtons from './OptionButtons';
import ListChoicePopup from './ListChoicePopup';

interface MenuContextType {
    toggleListChoiceMenu: (open: boolean) => void
}
const MenuContext = React.createContext<MenuContextType>(undefined);

const OptionsMenu: React.FC = () => {
    const listChoiceOpened = !!useRouteMatch('/:listID/build-list/list-choice');
    const { listID } = useParams<{listID : string}>();
    const history = useHistory();
    const menuContextValue: MenuContextType = {
        toggleListChoiceMenu: (shouldOpen) => {
            console.log('toggle ', shouldOpen ? 'open' : 'close');
            if (shouldOpen) {
                // console.log(`pushing /${listID}/build-list/list-choice`);
                history.push(`/${listID}/build-list/list-choice`);
            } else {
                // console.log('going back');
                history.replace(`/${listID}/build-list`);
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
