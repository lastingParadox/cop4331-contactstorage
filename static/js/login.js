function login(event) {
    console.log("here")
    
	let login = document.getElementById("login-username").value;
	let password = document.getElementById("login-password").value;

    let inData = {
        login: login, 
        password: password
    };

    console.log("here1")
    // To do after the response
    let callbacks = {}
    callbacks.error   = function(response) {
        document.getElementById("loginResult").innerHTML = "An error occurred: " + response.error;
    }
    callbacks.success = function(response) {
        firstName = response.firstName;
        lastName  = response.lastName;
        userId    = response.id;

        console.log(response);
        console.log("Received login data:" + firstName + " " + lastName + " " + userId);

        if (userId < 1) {
            callbacks.error({error : "Login Information invalid"});
            return;
        }

        saveCookie();
        window.location.href = "dashboard.html";
    }

    // Send request
    let url = urlBase + '/login.php';
    sendRequest(inData, url, callbacks);

    return false;
}
