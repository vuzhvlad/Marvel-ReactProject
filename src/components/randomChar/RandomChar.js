import {useState, useEffect} from 'react';
import Spinner from '../spinner/PicSpinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMsg';


import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    // all states
    const [char, setChar] = useState({});
    const {loading, error, getCharacter, clearError} = useMarvelService(); // service for getting characters, our custom hook, with all states and methods

    useEffect(() => { // after page renders mounting
        updateChar();

        const timerId = setInterval(updateChar, 10000);

        return () => { // component will unmount
            clearInterval(timerId)
        }

    }, []);

    const onCharLoaded = (char) => { // when char  is loaded
        setChar(char);
    }

    const updateChar = () => {  // updating char
        clearError(); // every time we request for new character it cleans our error
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000); // rnadomizer
 
        getCharacter(id) // getting character by id
        .then(onCharLoaded) // the arg that we get from promise will autmatically be a parametr for our funct inside of .then
    }

    const errorMessage = error ? <ErrorMessage/> : null; // boolean or null
    const spinner = loading ? <Spinner/> : null; // boolean or null
    const content = !(loading || error) ? <View char={char}/> : null; // if we dont have loading or error then we show content
    // ternar for showing what is happening on the page depedingon state, if it is a null it wont be shown on the page

    return (
        <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another ones
                    </p>
                    <button className="button button__main">
                        <div onClick={updateChar} className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
    )
}

const View = ({char}) => { // function where we just have no logical data with characters
    const {name, description, thumbnail, homepage, wiki} = char; // jsut getting data from prop

    let styleImg= { objectFit: "cover" };
    if(thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') { // if it is character without image we use this one
        styleImg = { "objectFit" : "contain" };
    }

    return (
        <div className="randomchar__block">
            <img style={styleImg} src={thumbnail} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                        </div>
                    </div>
                </div>
    )
}

export default RandomChar;