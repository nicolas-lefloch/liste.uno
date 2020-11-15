import React from 'react';
import './ressources/App.css';
import {
    BrowserRouter as Router,
    Switch,
    Redirect,
    Route,
    Link,
    useParams,
} from 'react-router-dom';

import BuildShoppingList from './components/BuildShoppingList';
import WhileShoppingList from './components/WhileShoppingList';
import ShoppingListService from './services/ShoppingList.service';
import { ReactComponent as MainLogo } from './ressources/svg/logo-large.svg';
import SwitchListMode from './components/SwitchListMode';
import ShareList from './components/ShareList';
import PromptInstall from './components/PromptInstall';
import LocationHistory from './components/LocationHistory';
import { SnackBarProvider } from './utilities/SnackBar';

const WatchForlistID: React.FC<{children}> = ({ children }) => {
    const { listID } = useParams<{listID:string}>();
    if (listID) {
        ShoppingListService.setCurrentList(listID);
    }
    return children;
};

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
                    <Route path="/about">
                        <p>Coucou c chim et chim</p>
                    </Route>
                    <Route path="/:listID/shopping">
                        <div className="switch-and-share">
                            <SwitchListMode />
                            <ShareList />
                        </div>
                        <PromptInstall />
                        <WatchForlistID>
                            <WhileShoppingList />
                        </WatchForlistID>
                    </Route>
                    <Route path="/:listID/hacker">
                        <WatchForlistID>
                            <LocationHistory />
                        </WatchForlistID>
                    </Route>

                    <Route path="/:listID" exact>
                        <div className="switch-and-share">
                            <SwitchListMode />
                            <ShareList />
                        </div>
                        <PromptInstall />
                        <WatchForlistID>
                            <BuildShoppingList />
                        </WatchForlistID>
                    </Route>
                    <Route path="/" exact>
                        <Redirect
                            to={{
                                pathname: `/${ShoppingListService.getDefaultListID()}`,
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
