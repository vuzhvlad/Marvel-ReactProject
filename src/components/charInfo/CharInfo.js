import {useState, useEffect} from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';


const CharInfo = (props) => {    

    const [char, setChar] = useState(null);
    const {getCharacter, clearError, process, setProcess} = useMarvelService(); // service for getting characters

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
                .then(() => setProcess('confirmed')); // only when it is loaded process will be ended
    }

    const onCharLoaded = (char) => { 
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}


const View = ({data}) => { // non logical part
    const {name, description, thumbnail, homepage, wiki, comics} = data;

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
                        comics.slice(0, 9).map((item, i) => { // creating map for getting all comics for character
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

export default CharInfo;