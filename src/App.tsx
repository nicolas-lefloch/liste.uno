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

function WhileShoppingListChild() {
    const { id } = useParams();
    const usedID = ShoppingListService.init(id);
    return (
        <>
            <WhileShoppingList />
            <Link to={`/list/${usedID}`}>
                <button type="button" className="circular massive ui icon button" title="Go shopping">
                    <i className="play icon" style={{ transform: 'rotate(180deg)' }} />
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
                <button type="button" className="circular green massive ui icon button" title="Go shopping">
                    <i className="play icon" />
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
                    </header>
                </div>
            </div>
        </Router>
    );
}

export default App;
