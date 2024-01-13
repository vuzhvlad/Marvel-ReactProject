import {useState, useEffect, useRef} from 'react';
import Spinner from '../spinner/PicSpinner';
import ErrorMessage from '../errorMessage/ErrorMsg';
import useMarvelService from '../../services/MarvelService';

import './charList.scss';


const CharList = (props) => {

    //all states
    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService(); // service for getting character

    useEffect(() => { // for mounting once it is rendered
        onRequest(offset, true);
    }, []);

    const onRequest = (offset, initial) => {  // getting charcters
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
        .then(onCharListLoaded) 
    }

    const onCharListLoaded = (newCharList) => { 
        
        let ended = false;
        if(newCharList.length < 9) { 
            ended = true;
        }   

        const filteredChars = newCharList.filter((newChar) => {
            return charList.find((oldChar) => {
                return oldChar.id === newChar.id;
            }) === undefined;
        });

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 18);
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

            let imgStyle = {'objectFit' : 'cover'}; // for items without images
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
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
            )
        });
        
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    } // returning structure where all characters are inside

    const items = renderItems(charList); 

            
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    console.log("charList");

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
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