import {useState, useCallback} from "react";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => { // we put this function inside of useCallback cause we predict that it wont be needed to be called when page rerenders every time, also it is async because it is request

        setLoading(true); // starting loading

        try {
            const response = await fetch(url, {method, body, headers}); // we sent a fetch by url and setting inside of the object

            if(!response.ok) { // we are checking if response is okay if it is not we are going to catch
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }
    
            const data = await response.json(); // transfer our response from json to normal js

            setLoading(false); //everything is uploaded so loading is false
            return data;

        } catch(e) {
            setLoading(false); // stopping loading
            setError(e.message); // sending the message of our error that we ve got
            throw e; // throwing error
        }

    }, []); // function for creating request

    const clearError = useCallback(() => setError(null), []); // function for setting error to null again

    return {loading, request, error, clearError}
}