// for testing
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createNewContact() {
    // the user that entered the data
    var userId = readCookie().userId;

    // data the user entered
    let inData = {
        userId:userId, // id of the sender
        firstName:document.getElementById("firstName").value, // required
        lastName:document.getElementById("lastName").value,
        phoneNumber:document.getElementById("phoneNumber").value, 
        email:document.getElementById("email").value,
        occupation:document.getElementById("occupation").value,
        address:document.getElementById("address").value,
        notes:document.getElementById("notes").value,
    };

    // To do after the response
    let callbacks = {}
    callbacks.error = function(response) {
        document.getElementById("result").innerHTML = response.error;
    }
    callbacks.success = function(response) {
        window.location.href = "dashboard.html";
    }

    // Send request
    let url = urlBase + '/createContact.php';
    sendRequest(inData, url, callbacks);
    
}