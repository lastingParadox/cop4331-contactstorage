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

    let url = urlBase + '/register.php';

    let request = new XMLHttpRequest();
    request.open("POST", url, true);
	  request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    let registerInformation = {
        username: username, 
        password: password,
        firstName: firstName, 
        lastName: lastName
    };

    try {
        request.onload = function () {
            let response = JSON.parse(request.responseText);

            // failed to register user (probably a duplicate username or something)
            if (response.error) {
                //document.getElementById("registerResult").innerHTML = response.error; 
                console.log(response.error);
                return;
            }

            // successfully registered user
            console.log("successfully registered");
            window.location.href= "index.html";
        }
        request.send(JSON.stringify(registerInformation));
    } catch(err) {
		//document.getElementById("registerResult").innerHTML = err.message;
        console.log(err.message);
	}

  return false;
}
