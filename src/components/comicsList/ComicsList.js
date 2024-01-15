import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/PicSpinner';
import ErrorMessage from '../errorMessage/ErrorMsg';

import './comicsList.scss';

const ComicsList = () => {

    //all states
    const [comicsList, setComicsList] = useState([]); // list
    const [newItemLoading, setnewItemLoading] = useState(false); // if we load anything new
    const [offset, setOffset] = useState(0); // offset
    const [comicsEnded, setComicsEnded] = useState(false); // if it is ended

    const {loading, error, getAllComics} = useMarvelService(); // getting states and method from our custom hook

    useEffect(() => { // mounting for the first time
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => { // function for reqesting our comics
        initial ? setnewItemLoading(false) : setnewItemLoading(true);

        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {

        let ended = false;
        if (newComicsList.length < 8) { // if it is ended
            ended = true;
        }

        setComicsList([...comicsList, ...newComicsList]);
        setnewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    function renderItems (arr) { // function for rendering all the items on the page
        const comics = arr.map((item, i) => { // it also created links for every comics that creates unique link by id of comics
            return (
                <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}> 
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            )
        })

        return (
            <ul className="comics__grid">
                {comics}
            </ul>
        )
    }

    const comics = renderItems(comicsList); // putting all comics into var

    const errorMessage = error ? <ErrorMessage/> : null; // if error is true
    const spinner = loading && !newItemLoading ? <Spinner/> : null; // if loading is true and newiteloading is false

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {comics}
            <button 
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;