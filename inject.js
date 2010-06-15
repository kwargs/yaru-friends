
var main = function(){
    // достаём куку yandex_login
    console.debug(document.cookie);
    var ya_login = document.cookie.split(';').filter(function(c){
        return /^\s+yandex_login/.test(c);
    })[0];
    if (ya_login){
        ya_login = ya_login.split('=')[1];
    }
    chrome.extension.sendRequest(
        { ask: "set_current_user", login: ya_login },
        function(response){}
    );
}();

