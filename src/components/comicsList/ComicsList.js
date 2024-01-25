import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/PicSpinner';
import ErrorMessage from '../errorMessage/ErrorMsg';

import './comicsList.scss';

const setContent = (process, Component, newItemLoading) => { // special FSM because charlist has unique logic for loading new items 
    switch (process) {
        case 'waiting':
            return <Spinner/>;
            break;
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>; // we render new items ? then we render component if no it is a first loading so we load spinner
            break;
        case 'confirmed':
            return <Component/>;
            break;
        case 'error':
            return <ErrorMessage/>;
            break;
        default: 
            throw new Error('Unexpected process state');
    }
}

const ComicsList = () => {

    //all states
    const [comicsList, setComicsList] = useState([]); // list
    const [newItemLoading, setnewItemLoading] = useState(false); // if we load anything new
    const [offset, setOffset] = useState(8); // offset
    const [comicsEnded, setComicsEnded] = useState(false); // if it is ended

    const {loading, error, getAllComics, process, setProcess} = useMarvelService(); // getting states and method from our custom hook

    useEffect(() => { // mounting for the first time
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => { // function for reqesting our comics
        initial ? setnewItemLoading(false) : setnewItemLoading(true);

        getAllComics(offset)
            .then(onComicsListLoaded)
            .then(() => setProcess('confirmed'));
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
                <CSSTransition 
                    key={item.id} 
                    timeout={500}
                    classNames="comics__item">
                    <li className="comics__item" key={i}>
                    <Link to={`/comics/${item.id}`}> 
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
                </CSSTransition>
            )
        })

        return (
            <ul className="comics__grid">
                <TransitionGroup component={null}>
                    {comics}
                </TransitionGroup>
            </ul>
        )
    }

    return (
        <div className="comics__list">
            {setContent(process, () => renderItems(comicsList), newItemLoading) /* instead of component we send a function that creates it */} 
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