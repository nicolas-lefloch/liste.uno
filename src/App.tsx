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
                                <Link to="/"><i className="gg-back-button" /></Link>
                            </Route>
                            <Route path="/">
                                <BuildShoppingList />
                                <Link to="/shop"><i className="gg-play-button" /></Link>
                            </Route>
                        </Switch>
                    </header>
                </div>
            </div>
        </Router>
    );
}

export default App;
