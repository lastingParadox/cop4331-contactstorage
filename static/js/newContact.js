// for testing
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createNewContact() {
    // the user that entered the data
    let userId = readCookie().userId;

    // data the user entered
    let inData = {
        userId: userId, // id of the sender
        firstName: document.getElementById("add-firstName").value, // required
        lastName: document.getElementById("add-lastName").value,
        phoneNumber: formatPhoneNumber(
            document.getElementById("add-phoneNumber").value
        ),
        email: document.getElementById("email").value,
        occupation: document.getElementById("add-occupation").value,
        address: document.getElementById("add-address").value,
    };

    // To do after the response
    let callbacks = {};
    callbacks.error = function (response) {
        document.getElementById("result").innerHTML = response.error;
    };
    callbacks.success = function (response) {
        window.location.href = "dashboard.html";
    };

    // Send request
    let url = urlBase + "/createContact.php";
    sendRequest(inData, url, callbacks);
}

function formatPhoneNumber(string) {
    let cleaned = ("" + string).replace(/\D/g, "");

    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return match[1] + match[2] + match[3];
    }
    return string;
}
