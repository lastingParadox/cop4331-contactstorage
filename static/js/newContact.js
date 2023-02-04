function createNewContact() {

    // the user that entered the data
    var splice1 = document.cookie.split(',')[2];
    var userId  = splice1.charAt(splice1.length - 1);

    var url = urlBase + '/api/createContact.php';

    var request = new XMLHttpRequest();
    request.open("POST", url, true);
	request.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    // data the user entered
    var contactInformation = {
        userId:userId, // id of the sender
        firstName:document.getElementById("firstName").value, // required
        lastName:document.getElementById("lastName").value,
        phoneNumber:document.getElementById("phoneNumber").value, 
        email:document.getElementById("email").value,
        occupation:document.getElementById("occupation").value,
        address:document.getElementById("address").value,
        notes:document.getElementById("notes").value,
    };

    try {
        request.onload = function () {
            var response = JSON.parse(request.responseText);
			
            // failed to create a new contact (display the error)
            if (response.error) {
                document.getElementById("result").innerHTML = response.error;
                return;
            }

            // successfully created a new contact
            window.location.href = "dashboard.html";
        }

        console.log("sending " + JSON.stringify(contactInformation));
        request.send(JSON.stringify(contactInformation));
    } catch(err) {
		document.getElementById("result").innerHTML = err.message;
	}

}
