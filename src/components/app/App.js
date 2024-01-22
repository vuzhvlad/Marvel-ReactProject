import {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

//import { Page404, MainPage, ComicsPage, SingleComicPage } from "../pages/index"; // it will be looking for index.js that is inside of this folder 
import AppHeader from "../appHeader/AppHeader";
import Spinner from '../spinner/PicSpinner';

const Page404 = lazy(() => import('../pages/404')); // react lazy, will import this page only when we need it
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() => import('../pages/SingleComicPage'));


const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/comics" element={<ComicsPage/>}/>
                            <Route path="/comics/:comicId" element={<SingleComicPage/>}/>
                            <Route path="*" element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;