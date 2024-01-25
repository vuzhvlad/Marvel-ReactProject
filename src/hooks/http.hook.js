import {useState, useCallback} from "react";

export const useHttp = () => {
    const [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => { // we put this function inside of useCallback cause we predict that it wont be needed to be called when page rerenders every time, also it is async because it is request

        setProcess('loading');

        try {
            const response = await fetch(url, {method, body, headers}); // we sent a fetch by url and setting inside of the object

            if(!response.ok) { // we are checking if response is okay if it is not we are going to catch
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }
    
            const data = await response.json(); // transfer our response from json to normal js

            return data;

        } catch(e) {
            setProcess('error');
            throw e; // throwing error
        }

    }, []); // function for creating request

    const clearError = useCallback(() => {
        setProcess('loading');
    }, []); // function for setting error to null again

    return {request, clearError, process, setProcess}
}