const urlBase = 'https://contactstorage.info';
const completedRequest = 4;

function registerFunc(t) {

    var firstName = document.getElementById("firstName").value
    var lastName  = document.getElementById("lastName").value; // can be ""
    var username  = document.getElementById("loginName").value;
    var password  = document.getElementById("loginPassword").value;

    var url = urlBase + '/api/register.php';

    var request = new XMLHttpRequest();
    request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    var registerInformation = {
        username:username, 
        password:password,
        firstName:firstName, 
        lastName:lastName
    };

    try {
        request.onload = function () {
            var response = JSON.parse(request.responseText);
			
            document.getElementById("registerResult").innerHTML = "duplicate user";

            // failed to register user (probably a duplicate username or something)
            if (response.error) {
                document.getElementById("registerResult").innerHTML = response.error;
                return;
            }

            // successfully registered user
            window.location.href= "index.html";
        }
        request.send(JSON.stringify(registerInformation));
    } catch(err) {
		document.getElementById("registerResult").innerHTML = err.message;
	}

}