import {useState} from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import {Link} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMsg';

import './charSearchForm.scss';

const CharSearchForm = () => { // component for searching form of single char by using formik
    const [char, setChar] = useState(null); // setting state for char
    const {loading, error, getCharacterByName, clearError} = useMarvelService(); // getting mathods from service

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name)
            .then(onCharLoaded);
    }

    const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null;

    const results = !char ? null : char.length > 0 ? 
                    <div className="char__search-wrapper">
                        <div className="char__search-success">There is! Do you want to {char[0].name} page?</div>
                        <Link to={`/characters/${char[0].id}`} className="button button__secondary"> 
                            <div className="inner">To page</div>
                        </Link>
                    </div> : 
                    <div className="char__search-error">
                        The character was not found. Check the name and try again
                    </div>; // html for character if it was found, if it was not it gives us empty array so we can show that we didnt find any characters

    return (
        <div className="char__search-form">
            <Formik
                initialValues = {{ // initial values that our form will have
                    charName: ''
                }}
                validationSchema = {Yup.object({ // using Yup for validation
                    charName: Yup.string().required('This field is required')
                })}
                onSubmit = { ({charName}) => { // calling update char by charname in initial values so we send our form from waht user typed inside
                    updateChar(charName);
                }}
            >
                <Form>
                    <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field 
                            id="charName" 
                            name='charName' 
                            type='text' 
                            placeholder="Enter name"/>
                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}>
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="charName" />
                </Form>
            </Formik>
            {results}
            {errorMessage}
        </div>
    )
}

export default CharSearchForm;