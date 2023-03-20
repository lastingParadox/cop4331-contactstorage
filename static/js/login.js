// Front-End Functionalities

const loginButton = document.querySelector(".loginButton");
const loginSubmit = document.getElementById("login-submit");
const registerButton = document.querySelector(".registerButton");
const registerSubmit = document.getElementById("register-submit");
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
        document.getElementById("login-error").innerHTML =
            "Invalid username or password";
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
    let email = document.getElementById("register-email").value;
    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;

    let inData = {
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
    };

    // To do after the response
    let callbacks = {};
    callbacks.error = function (response) {
        registerSubmit.disabled = true;
        let user_field = document.getElementById("register-username");
        let user_invalid = document.getElementById("username-invalid");
        user_invalid.style.visibility = "visible";
        user_field.style.borderColor = "red";
        user_invalid.innerHTML = "Username already exists!";
    };
    callbacks.success = function (response) {
        window.location.href = "index.html";
    };

    // Send request
    let url = urlBase + "/register.php";
    sendRequest(inData, url, callbacks);

    return false;
}

function usernameColor(input) {
    let error = document.getElementById("username-invalid");

    if (input.style.borderColor === "red") {
        registerSubmit.disabled = false;
        error.innerHTML = "Error";
        input.style.borderColor = "black";
        error.style.visibility = "hidden";
    }
}

function passwordValidity(input) {
    const value = input.value;
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const isValid = regex.test(value);

    let error = document.getElementById("password-invalid");
    if (!isValid) {
        registerSubmit.disabled = true;
        error.style.visibility = "visible";
        input.style.borderColor = "red";
        error.innerHTML =
            "Password must be greater than 8 characters, contain an uppercase and lowercase letter, a number, and a special character.";
    } else {
        registerSubmit.disabled = false;
        error.style.visibility = "hidden";
        input.style.borderColor = "black";
        error.innerHTML = "Error";
    }
}
