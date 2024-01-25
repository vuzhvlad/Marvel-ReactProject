import {useState, useEffect, useRef, useMemo} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';


import './charList.scss';
import Spinner from '../spinner/PicSpinner';
import ErrorMessage from '../errorMessage/ErrorMsg';

const STEP = 9

const setContent = (process, Component, newItemLoading) => { // special FSM because charlist has unique logic for loading new items 
    switch (process) {
        case 'waiting':
            return <Spinner/>;     
        case 'loading':
            return newItemLoading ? <Component/> : <Spinner/>; // we render new items ? then we render component if no it is a first loading so we load spinner       
        case 'confirmed':
            return <Component/>;      
        case 'error':
            return <ErrorMessage/>;           
        default: 
            throw new Error('Unexpected process state');
    }
}

const CharList = (props) => {

    //all states
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService(); // service for getting character

    useEffect(() => { // for mounting once it is rendered
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {  // getting charcters
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(onCharListLoaded)
            .then(() => setProcess('confirmed')); 
    }

    const onCharListLoaded = (newCharList) => { 
        
        let ended = false;
        if(newCharList.length < STEP) { 
            ended = true;
        }   

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + STEP);
        setCharEnded(charEnded => ended);
    }

    const itemRefs = useRef([]); // creating ref

    const focusOnItem = (id) => { // method that calls after click on char
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected')); // we are removing active class from all characters
        itemRefs.current[id].classList.add('char__item_selected'); // then we put active class on item with special id we clicked on
        itemRefs.current[id].focus(); // then we put focus on this character
    }

    function renderItems(arr) { // fucntion for rendering all characters
        const items =  arr.map((item, i) => { // function for creating every item

            let imgStyle = {'objectFit' : 'cover'}; 
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'}; // for items without images
            }
            
            return (
                <CSSTransition 
                    key={item.id}
                    timeout={500}
                    classNames="char__item">
                    <li 
                    className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el} // formatting ref inside for every element 
                    key={item.id}
                    onClick={() => {
                        props.onCharSelected(item.id); // after clicking we select item on id we ve got from props and send it to charInfo
                        focusOnItem(i); // make focus on the item we clicked on
                        }}

                    onKeyDown={(e) => { // event for presing key
                        if(e.key === ' ' || e.key === "Enter") { // for pressing enter
                            props.onCharSelected(item.id); // doing the same stuff just make our page a bit more interactive
                            focusOnItem(i);
                        }
                    }}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                </CSSTransition>
            )
        });
        
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    } // returning structure where all characters are inside

    const elements = useMemo(() => { // fixed problem with not working classes and rerendering by useMemo
        return setContent(process, () => renderItems(charList), newItemLoading)
    }, [process]);

    return (
        <div className="char__list">
            {elements}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default CharList;