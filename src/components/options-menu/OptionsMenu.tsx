import React, { useContext, useState } from 'react';
import OptionButtons from './OptionButtons';
import ListChoicePopup from './ListChoicePopup';

interface MenuContextType {
    toggleListChoiceMenu: (open: boolean) => void
}
const MenuContext = React.createContext<MenuContextType>(undefined);

const OptionsMenu: React.FC = () => {
    const [listChoiceOpened, setListChoiceOpened] = useState(false);
    const menuContextValue: MenuContextType = {
        toggleListChoiceMenu: (shouldOpen) => setListChoiceOpened(shouldOpen),
    };
    return (
        <div id="options-menu-container">
            <div id="options-menu">
                <MenuContext.Provider value={menuContextValue}>
                    <OptionButtons />
                    <ListChoicePopup opened={listChoiceOpened} />
                </MenuContext.Provider>
            </div>
        </div>
    );
};
export const useOptionsMenu = () => useContext(MenuContext);
export default OptionsMenu;
