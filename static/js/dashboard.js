document.addEventListener('DOMContentLoaded', () => searchContacts(""), false);

function editContact() {

}

function deleteContact() {

}

function searchContacts(params) {

    // the user that entered the data
    var userId = readCookie().userId;

    // Building Parameters
    let searchParams = params || /* document.getElementById("searchParams") || */ "";
    let inData = {
        userId:userId,
        search:searchParams,
    }

    let container = document.getElementById("contact_container");

    // To do after the response (nothing yet)
    let callbacks = {}
    callbacks.error   = function(response) {};
    callbacks.success = function(response) {
        response.forEach(contact => {
            // add the innerHTMLs
            console.log(contact);

            container.innerHTML += `
            <div class="contact" style="width:33%;">
                <p class="first_name">First Name: ${contact.firstName || "[None Entered]"}</p>
                <p class="last_name">Last Name: ${contact.lastName || "[None Entered]"}</p>
                <p class="phone_number">Phone Number: ${contact.phoneNumber || "[None Entered]"}</p>
                <p class="occupation">Occupation: ${contact.occupation || "[None Entered]"}</p>
                <p class="email">Email:${contact.email || "[None Entered]"}</p>
                <p class="address">Address:${contact.address || "[None Entered]"}</p>
                <button>Edit</button>
                <button>Delete</button>
            </div>`
        });
    };

    // Send request
    let url = urlBase + '/searchContacts.php';
    sendRequest(inData, url, callbacks);

}
