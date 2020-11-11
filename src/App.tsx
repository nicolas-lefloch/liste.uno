import React from 'react';
import './ressources/App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faEdit } from '@fortawesome/free-solid-svg-icons';
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

function WhileShoppingPage() {
    const { listID } = useParams<{listID:string}>();
    ShoppingListService.setCurrentList(listID);
    return (
        <>
            <WhileShoppingList />
            <Link to={`/${listID}`}>
                <button type="button" className="circular big icon button" title="Editer la liste">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
            </Link>
        </>
    );
}

function BuildingListPage() {
    const { listID } = useParams<{listID:string}>();
    ShoppingListService.setCurrentList(listID);
    return (
        <>
            <Link to={`/${listID}/shopping`}>
                <button type="button" className="circular green big  icon button" title="Go shopping">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>
            </Link>
            <BuildShoppingList />
        </>
    );
}

function App() {
    return (
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
                    <WhileShoppingPage />
                </Route>
                <Route path="/:listID" exact>
                    <BuildingListPage />
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
    );
}

export default App;
