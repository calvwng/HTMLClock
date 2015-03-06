// Client ID: fbe2ec80131b55b

// Create an init funciton that accepts JSON object as
// parameter & stores them for use during login
// client_id, type (code or token), callback_function
function init(jsonObj) {
    localStorage.setItem("client_id", jsonObj.client_id);
    localStorage.setItem("type", jsonObj.type);
    localStorage.setItem("callback_function", jsonObj.callback_function);
}

// Create a login function that launches the Imgur OAuth flow 
// in a new popup window, which will redirect to the Callback URL 
// after success or failure.
function login() {
    client_id = localStorage.getItem("client_id");
    type = localStorage.getItem("type");
    window.open('https://api.imgur.com/oauth2/authorize?client_id=' + client_id 
                + '&response_type=' + type, "", "width=980, height=600");
}