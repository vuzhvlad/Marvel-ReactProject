import {useState, useEffect} from 'react';
import { PropTypes } from 'prop-types';
import Spinner from '../spinner/PicSpinner';
import ErrorMessage from '../errorMessage/ErrorMsg';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';



const CharInfo = (props) => {    

    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} = useMarvelService(); // service for getting characters

    useEffect(() => { // compponent will change depeding on charId
        updateChar();
    }, [props.charId]);

    const updateChar = () => { // for updating 
        const {charId} = props; // destrucitirsation of id from props

        if(!charId) { // in case we dont have it
            return;
        }   
            clearError(); // to clean error if something goes wrong
            
            getCharacter(charId) // then we get character by id
            .then(onCharLoaded) // and load this character and changing state
    }

    const onCharLoaded = (char) => { 
        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>; // if any of these true we dont put anything if they are false we use skeleton
    const errorMessage = error ? <ErrorMessage/> : null; // boolean or null
    const spinner = loading ? <Spinner/> : null; // boolean or null
    const content = !(loading || error || !char) ? <View char={char}/> : null; // if we dont have loading or error or char then we show content
    // ternar for showing what is happening on the page depedingon state, if it is a null it wont be shown on the page

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}


const View = ({char}) => { // non logical part
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let styleImg= { objectFit: "cover" };
    if(thumbnail.indexOf('image_not_available') > -1) { // if it is character without image we use this one
        styleImg = { objectFit : "contain" };
    }

    return (
        <>
        <div className="char__basics">
                    <img style={styleImg} src={thumbnail} alt={name}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                     {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    {comics.length > 0 ? null : 'There is no comics for this character'}
                    
                    {
                        comics.map((item, i) => { // creating map for getting all comics for character
                            if(i > 9) return; // if it is more than 10 comics we just stop
                            return (
                                <li key={i} className="char__comics-item">
                                {item.name}
                                </li>
                            )
                        })
                    }
                </ul>
        </>
    )
}

CharInfo.propTypes = { // checking the type of prop
    charId: PropTypes.string
}

export default CharInfo;