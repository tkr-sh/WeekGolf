import { createSignal, onMount, useContext } from "solid-js";
import { DisplayMessageContext, DisplayMessageProviderType } from "./createDisplayMessage";

const createAuth = () => {
    // state to store the token
    const [token, setToken] = createSignal(localStorage.getItem('token'));
    const {handleError} = useContext(DisplayMessageContext) as DisplayMessageProviderType;

    onMount(() => {
        // Get the token from localstorage
        const tokenFromStorage = localStorage.getItem('token');
        setToken(tokenFromStorage);
    });

    // Function to send the token with the headers of your fetch requests
    const authFetch = async (url: string, options: any = {}, showError: boolean=true) => {

        options.headers = options.headers || {};
        options.headers.Authorization = `Basic ${token()}`;

        // Send the fetch request with the updated headers
        const response = await fetch(url, options);

        // Get data back
        const error: boolean = response.status >= 400; // If there is an errors
        const contentType = response.headers.get('Content-Type'); // Get the content-type
        let data: any; // Get the data

        if (contentType && contentType.includes('application/json')) {
            data = await response.json(); // It's json
        } else {
            data = await response.text(); // It's text
        }

        // If there is an error
        if (error && showError) {
            handleError(data.toString());
        }

        return {data, error, contentType};
    };

    return { token, authFetch };
}


export default createAuth;