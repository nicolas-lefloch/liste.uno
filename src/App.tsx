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

function WhileShoppingListChild() {
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

function BuildShoppingListChild() {
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
            <div>
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <div className="App">
                    <header className="App-header">
                        <h1>GEOSHOP</h1>
                        <Switch>
                            <Route path="/shop/:listID">
                                <WhileShoppingListChild />
                            </Route>
                            <Route path="/list/:listID">
                                <BuildShoppingListChild />
                            </Route>
                            <Route path="/">
                                <Redirect
                                    to={{
                                        pathname: `/list/${ShoppingListService.getDefaultListID()}`,
                                    }}
                                />
                            </Route>
                        </Switch>
                    </header>
                </div>
            </div>
        </Router>
    );
}

export default App;
