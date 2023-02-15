const urlBase = "https://contactstorage.info/api";

let userId = 0;
let firstName = "";
let lastName = "";
let side_nav = "";
let cookieName = "ContactStorageUser";

// BACKEND FUNCTIONS

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        cookieName +
        "=" +
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ",side_nav=active" +
        ";expires=" +
        date.toGMTString();
}

function logout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie =
        cookieName +
        "=" +
        "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let test = data.split("; ");

    for (let i = 0; i < test.length; i++) {
        if (test[i].includes(cookieName)) {
            data = test[i];
            break;
        }
    }

    data = data.replace(`${cookieName}=`, "");

    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        } else if (tokens[0] == "side_nav") {
            side_nav = tokens[1];
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        //document.getElementById("welcome").innerHTML = "Hello, " + firstName + " " + lastName;
    }

    return {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        userId: userId,
        side_nav: side_nav,
    };
}

function setCookie(cName, cValue, expMinutes) {
    let cookie = readCookie();

    firstName = cookie.firstName;
    lastName = cookie.lastName;
    userId = cookie.userId;
    side_nav = cookie.side_nav;

    let date = new Date();
    date.setTime(date.getTime() + expMinutes * 60 * 1000);
    const expires = "expires=" + date.toGMTString();

    switch (cName) {
        case "userId":
            userId = cValue;
            break;
        case "firstName":
            firstName = cValue;
            break;
        case "lastName":
            lastName = cValue;
            break;
        case "side_nav":
            side_nav = cValue;
            break;
        default:
            return;
    }

    document.cookie =
        cookieName +
        "=" +
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ",side_nav=" +
        side_nav +
        ";expires=" +
        date.toGMTString();
}

function sendRequest(inData, url, callbacks) {
    let request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        request.onload = function () {
            console.log(
                "[Received Data (" + url + ")]: " + request.responseText
            );
            let response = JSON.parse(request.responseText);

            // failed to accomplish the request (call callbacks.error)
            if (response.error) {
                console.log("[Request Error (" + url + ")]: " + response.error);
                callbacks.error(response);
                return;
            }

            // successful
            console.log(
                "[Request Success (" + url + ")]:  " + response.success
            );
            callbacks.success(response);
        };

        console.log(
            "[Sending Request (" + url + ")]: " + JSON.stringify(inData)
        );
        request.send(JSON.stringify(inData));
    } catch (err) {
        console.log("[Request Error (" + url + ")]: " + response.error);
        callbacks.error({ error: err.message });
    }
}
