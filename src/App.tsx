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
    const { id } = useParams();
    const usedID = ShoppingListService.init(id);
    return (
        <>
            <WhileShoppingList />
            <Link to={`/list/${usedID}`}>
                <button type="button" className="circular big icon button" title="Editer la liste">
                    <FontAwesomeIcon icon={faEdit} />
                </button>
            </Link>
        </>
    );
}

function BuildShoppingListChild() {
    const { id } = useParams();
    const usedID = ShoppingListService.init(id);
    return (
        <>
            <BuildShoppingList />
            <Link to={`/shop/${usedID}`}>
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
                    <header className="app-header">
                        <h1>
                            LISTE
                            <i style={{ color: 'darkslategrey' }}>.</i>
                            UNO
                        </h1>
                    </header>
                    <div className="app-container">
                        <Switch>
                            <Route path="/shop/:id">
                                <WhileShoppingListChild />
                            </Route>
                            <Route path="/list/:id">
                                <BuildShoppingListChild />
                            </Route>
                            <Route path="/">
                                <Redirect
                                    to={{
                                        pathname: `/list/${ShoppingListService.init(undefined)}`,
                                    }}
                                />
                            </Route>
                        </Switch>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
