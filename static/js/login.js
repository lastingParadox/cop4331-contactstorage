function login(event) {
    let login = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    let inData = {
        login: login,
        password: password,
    };

    // To do after the response
    let callbacks = {};
    callbacks.error = function (response) {
        document.getElementById("loginResult").innerHTML =
            "An error occurred: " + response.error;
    };
    callbacks.success = function (response) {
        firstName = response.firstName;
        lastName = response.lastName;
        userId = response.id;

        console.log(response);
        console.log(
            "Received login data:" + firstName + " " + lastName + " " + userId
        );

        if (userId < 1) {
            callbacks.error({ error: "Login Information invalid" });
            return;
        }

        saveCookie();
        window.location.href = "dashboard.html";
    };

    // Send request
    let url = urlBase + "/login.php";
    sendRequest(inData, url, callbacks);

    return false;
}

function register(event) {
    if (document.querySelectorAll(".form-control:invalid").length > 0) {
        event.preventDefault();
        return false;
    }

    let firstName = document.getElementById("register-firstname").value;
    let lastName = document.getElementById("register-lastname").value;
    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;

    let inData = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
    };

    // To do after the response
    let callbacks = {};
    callbacks.error = function (response) {};
    callbacks.success = function (response) {
        window.location.href = "index.html";
    };

    // Send request
    let url = urlBase + "/register.php";
    sendRequest(inData, url, callbacks);

    return false;
}

// Front-End Functionalities

const loginButton = document.querySelector(".loginButton");
const registerButton = document.querySelector(".registerButton");
const formBox = document.querySelector(".formBox");
const body = document.querySelector("body");

registerButton.onclick = function () {
    formBox.classList.add("active");
    body.classList.add("active");
};

loginButton.onclick = function () {
    formBox.classList.remove("active");
    body.classList.remove("active");
};
