import React from 'react';
import './ressources/App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from 'react-router-dom';
import BuildShoppingList from './components/BuildShoppingList';
import WhileShoppingList from './components/WhileShoppingList';

function App() {
    return (
        <Router>
            <div>
                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                <div className="App">
                    <header className="App-header">
                        <h1> GEOSHOP</h1>
                        <Switch>
                            <Route path="/shop">
                                <WhileShoppingList />
                                <Link to="/">
                                    <button type="button" className="circular massive ui icon button" title="Go shopping">
                                        <i className="play icon" style={{ transform: 'rotate(180deg)' }} />
                                    </button>
                                </Link>
                            </Route>
                            <Route path="/">
                                <BuildShoppingList />
                                <Link to="/shop">
                                    <button type="button" className="circular green massive ui icon button" title="Go shopping">
                                        <i className="play icon" />
                                    </button>
                                </Link>
                            </Route>
                        </Switch>
                    </header>
                </div>
            </div>
        </Router>
    );
}

export default App;
