import React from 'react';
import './ressources/App.css';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
    Link,
} from 'react-router-dom';

import BuildShoppingList from './components/BuildShoppingList';
import WhileShoppingList from './components/WhileShoppingList';
import { ReactComponent as MainLogo } from './ressources/svg/logo-large.svg';
import SwitchListMode from './components/SwitchListMode';
import ShareList from './components/ShareList';
import PromptInstall from './components/PromptInstall';
import LocationHistory from './components/LocationHistory';
import { SnackBarProvider } from './utilities/SnackBar';
import { ShoppingListProvider } from './services/ShoppingList.newservice';
import LocalStorageInterface from './services/LocalStorageInterface';
import OptionsMenu from './components/options-menu/OptionsMenu';

const BuildListPage: React.FC = () => (
    <>
        <BuildShoppingList />
        <OptionsMenu />
    </>
);
const ShoppingPage: React.FC = () => (
    <>
        <WhileShoppingList />
    </>

);

function App() {
    return (
        <SnackBarProvider>
            <Router>
                <header>
                    <h1>
                        <MainLogo />
                    </h1>
                </header>
                <Switch>
                    <Route path="/:listID">
                        <div className="switch-and-share">
                            <SwitchListMode />
                            <ShareList />
                        </div>
                        <PromptInstall />
                        <ShoppingListProvider>
                            <Route path="/:listID/build-list/:action?/:editedItemKey?">
                                <BuildListPage />
                            </Route>
                            <Route path="/:listID/shopping">
                                <ShoppingPage />
                            </Route>
                            <Route
                                path="/:listID"
                                exact
                                render={(props) => (
                                    <Redirect to={`/${props.match.params.listID}/build-list`} />
                                )}
                            />
                            <Route path="/:listID/hacker">
                                <LocationHistory />
                            </Route>
                        </ShoppingListProvider>
                    </Route>

                    <Route path="/" exact>
                        <Redirect
                            to={{
                                pathname: `/${LocalStorageInterface.getCurrentListId()}/build-list`,
                            }}
                        />
                    </Route>
                    <Route path="/">
                        <p>Not Found</p>
                        <p>
                            Go to&nbsp;
                            <Link to="/">Home</Link>
                        </p>
                    </Route>

                </Switch>
            </Router>
        </SnackBarProvider>

    );
}

export default App;
