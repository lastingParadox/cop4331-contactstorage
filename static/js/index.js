const urlBase = 'https://contactstorage.info/api';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let cookieName = "ContactStorageUser";

function login()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

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
                console.log(jsonObject);
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
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = cookieName + "=" + "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
    console.log(data);
    let test = data.split("; ");
    console.log(test);

    for (let i = 0; i < test.length; i++) {
        if (test[i].includes(cookieName)) {
            console.log(test[i])
            data = test[i];
            break;
        }
    }

    data = data.replace(`${cookieName}=`, "");

	let splits = data.split(",");
    console.log(splits);
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" ) {
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" ) {
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" ) {
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("welcome").innerHTML = "Hello, " + firstName + " " + lastName;
	}
}

function logout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = cookieName + "=" + "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
