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

function WhileShoppingPage() {
    const { listID } = useParams<{listID:string}>();
    ShoppingListService.setCurrentList(listID);
    return (
        <>
            <WhileShoppingList />
            <Link to={`/list/${listID}`}>
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
            <BuildShoppingList />
            <Link to={`/shop/${listID}`}>
                <button type="button" className="circular green big  icon button" title="Go shopping">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>
            </Link>
        </>
    );
}

function App() {
    return (
        <Router>
            <header className="app-header">
                <h1>
                    LISTE
                    <i style={{ color: 'darkslategrey' }}>.</i>
                    UNO
                </h1>
            </header>
            <Switch>
                <Route path="/shop/:listID">
                    <WhileShoppingPage />
                </Route>
                <Route path="/list/:listID">
                    <BuildingListPage />
                </Route>
                <Route path="/">
                    <Redirect
                        to={{
                            pathname: `/list/${ShoppingListService.getDefaultListID()}`,
                        }}
                    />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
