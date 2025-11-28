import { Outlet } from 'react-router';
import { ShoppingListProvider } from '../services/ShoppingList.newservice';
import { SnackBarProvider } from '~/utilities/SnackBar';
import MainLogo from '../ressources/svg/logo-large.svg?react';
import SwitchListMode from '~/components/SwitchListMode';
import ShareList from '~/components/ShareList';
import PromptInstall from '~/components/PromptInstall';

const ShoppingListLayout = () => {
    return (
        <SnackBarProvider>
            <ShoppingListProvider>
            <header>
                <h1>
                    <MainLogo />
                </h1>
            </header>
            <div className="switch-and-share">
                <SwitchListMode />
                <ShareList />
            </div>
            <PromptInstall />
                <Outlet />
            </ShoppingListProvider>
        </SnackBarProvider>
    );
};

export default ShoppingListLayout;