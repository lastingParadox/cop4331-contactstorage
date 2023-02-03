function login(event)
{

    if (document.querySelectorAll('.form-control:invalid').length > 0) {
        event.preventDefault();
        return false;
    }

	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;

    let temp = {login: login, password: password};
    let payload = JSON.stringify(temp);
    let url = urlBase + '/login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "Login information incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "dashboard.html";
            }
        }
        xhr.send(payload);
    }
    catch(err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

    return false;
}
