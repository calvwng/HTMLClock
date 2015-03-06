
/* redirection function to call upon loading redirection.html */
function redirect_init() {
    var getToken = function(hash) {
        var match = hash.match(/access_token=(\w+)/);
        return !!match && match[1];
    };
    var token = getToken(document.location.hash);
    if (token != null) {
        localStorage.setItem("token", token);
        callback = localStorage.getItem("callback_function");
        var foo = window.opener[callback];
        if (typeof foo === "function") {
            foo();
        }
    }
    // window.close();
}