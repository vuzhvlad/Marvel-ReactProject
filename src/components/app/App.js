import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import { ComicsPage, MainPage } from "../pages"; // it will be looking for index.js that is inside of this folder

import AppHeader from "../appHeader/AppHeader";


const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Switch>
                    <Route exact path="/">
                        <MainPage/>
                    </Route>
                    <Route exact path="/comics">
                        <ComicsPage/>
                    </Route>
                    </Switch>
                </main>
            </div>
        </Router>
    )
}

export default App;