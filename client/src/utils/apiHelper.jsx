//apiHelper
export const api = (path, method = "GET", body = null, credentials = null) => {

     // Base URL for the API
    const url = "http://localhost:5000/api" + path;

    const options = {// Options for the fetch call including method and headers
        method,
        headers: {}
    };

    // If a request body is provided, stringify it and add it to the options,
    // also set the Content-Type header to application/json
    if (body) {
        options.body = JSON.stringify(body);
        options.headers["Content-Type"] = "application/json; charset=utf-8";
    }

    // If credentials are provided, add an Authorization header with Basic Auth
    if (credentials) {
        const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);
        options.headers.Authorization = `Basic ${encodedCredentials}`;
    }
    

    return fetch(url, options);
};