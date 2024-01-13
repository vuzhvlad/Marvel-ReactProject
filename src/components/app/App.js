import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import { ComicsPage, MainPage } from "../pages"; // it will be looking for index.js that is inside of this folder

import AppHeader from "../appHeader/AppHeader";


const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/comics" element={<ComicsPage/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App;