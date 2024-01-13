import {useState} from 'react';

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from '../errBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

const MainPage = () => {

    const [selectedChar, setChar] = useState(null);

    const onCharSelected = (id) => { // function for putting id into state that we put on lower level of CharList and then we send this state to CharInfo
        setChar(id);
    }

    return (
        <>
            <RandomChar/>
                <div className="char__content">
                <CharList onCharSelected={onCharSelected}/>
                <ErrorBoundary>
                    <CharInfo charId={selectedChar}/>
                </ErrorBoundary>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;