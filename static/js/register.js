const completedRequest = 4;

function register(event) {

    if (document.querySelectorAll('.form-control:invalid').length > 0) {
        event.preventDefault();
        return false;
    }

    let firstName = document.getElementById("firstname").value;
    let lastName  = document.getElementById("lastname").value;
    let username  = document.getElementById("username").value;
    let password  = document.getElementById("password").value;

    let inData = {
        username: username, 
        password: password,
        firstName: firstName, 
        lastName: lastName
    };

    // To do after the response
    let callbacks = {}
    callbacks.error   = function(response) {}
    callbacks.success = function(response) {
        window.location.href= "index.html";
    }

    // Send request
    let url = urlBase + '/register.php';
    sendRequest(inData, url, callbacks);

    return false;
}
