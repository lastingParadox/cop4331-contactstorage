let selected_id = 0;
let contextmenu_width = 0;
let contacts;

document.addEventListener(
    "DOMContentLoaded",
    () => {

        searchContacts("");

        
        let exit_buttons = document.querySelectorAll(".exit-page");
        exit_buttons.forEach((button) => {
            button.addEventListener("click", () => {
                pageView(false);
            });
        });
    },
    false
);

function createNewContact() {
    // the user that entered the data
    let userId = readCookie().userId;

    if (!validateFields('create')) return false;

    let inData = {
        userId: userId, // id of the sender
        firstName: document.getElementById("create-firstName").value, // required
        lastName: document.getElementById("create-lastName").value,
        phoneNumber: phoneNumberToDigits(
            document.getElementById("create-phoneNumber").value
        ),
        email: document.getElementById("create-email").value,
        occupation: document.getElementById("create-occupation").value,
        address: document.getElementById("create-address").value,
        imageUrl: null,
    };

    let createCallbacks = {};
    createCallbacks.error = function (response) {};
    createCallbacks.success = function (response) {
        location.reload();
    };

    let photo = document.getElementById("create-picture").files[0];
    if (photo) {
        let formData = new FormData();
        let filename = `user_${userId}_contact_${selected_id}.png`;
        formData.append("picture", photo, filename);

        let url = urlBase + "/fileUpload.php";

        let callbacks = {};
        callbacks.error = function (response) {
            sendRequest(
                inData,
                urlBase + "/createContact.php",
                createCallbacks
            );
        };
        callbacks.success = function (response) {
            inData.imageUrl = filename;
            sendRequest(
                inData,
                urlBase + "/createContact.php",
                createCallbacks
            );
        };

        sendRequest(formData, url, callbacks);
    } else sendRequest(inData, urlBase + "/createContact.php", createCallbacks);

    return false; // disable reload
}

function editContact(clearBool = false) {
    let userId = readCookie().userId;

    if (!validateFields('edit')) return false;

    let inData = {
        id: selected_id,
        firstName: document.getElementById("edit-firstName").value,
        lastName: document.getElementById("edit-lastName").value,
        phoneNumber: phoneNumberToDigits(
            document.getElementById("edit-phoneNumber").value
        ),
        email: document.getElementById("edit-email").value,
        address: document.getElementById("edit-address").value,
        occupation: document.getElementById("edit-occupation").value,
    };

    let editCallbacks = {};
    editCallbacks.error = function (response) {};
    editCallbacks.success = function (response) {
        location.reload();
    };

    if (!clearBool) {
        let photo = document.getElementById("edit-picture").files[0];
        if (photo) {
            let formData = new FormData();

            let contact = contacts.find((contact) => contact.id === selected_id);

            if (!contact.imageUrl) filename = `user_${userId}_contact_${selected_id}_1.png`;
            else {
                formData.append("delete", contact.imageUrl)
                filename = contact.imageUrl.replace(/\.[^\.]+$/, "");
                filename = filename.slice(0, filename.length - 2) + "_" + (parseInt(filename.slice(-1)) + 1) + ".png";
            }

            formData.append("picture", photo, filename);

            let url = urlBase + "/fileUpload.php";

            let callbacks = {};
            callbacks.error = function (response) {
                sendRequest(
                    inData,
                    urlBase + "/editContact.php",
                    editCallbacks
                );
            };
            callbacks.success = function (response) {
                inData.imageUrl = filename;
                sendRequest(
                    inData,
                    urlBase + "/editContact.php",
                    editCallbacks
                );
            };

            sendRequest(formData, url, callbacks);
            return false;
        }
    } else inData.imageUrl = "null";

    sendRequest(inData, urlBase + "/editContact.php", editCallbacks);

    return false; // disable reload
}

function validateFields(name = "edit") {
    const prefix = `${name}-`;
    const valid = "is-valid";
    const invalid = "is-invalid";
    let validBool = true;

    const firstName = document.getElementById(`${prefix}firstName`);
    const lastName = document.getElementById(`${prefix}lastName`);
    const phoneNumber = document.getElementById(`${prefix}phoneNumber`);
    const email = document.getElementById(`${prefix}email`);
    const address = document.getElementById(`${prefix}address`);
    const occupation = document.getElementById(`${prefix}occupation`);

    if (firstName.value.length == 0) {
        validBool = false;
        firstName.classList.remove(valid);
        firstName.classList.add(invalid);
    } else {
        firstName.classList.remove(invalid);
        firstName.classList.add(valid);
    }
    
    if (lastName.value.length == 0) {
        validBool = false;
        lastName.classList.remove(valid);
        lastName.classList.add(invalid);
    } else {
        lastName.classList.remove(invalid);
        lastName.classList.add(valid);
    }

    let phoneNumRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (phoneNumber.value != "" && !phoneNumber.value.match(phoneNumRegex)) {
        validBool = false;
        phoneNumber.classList.remove(valid);
        phoneNumber.classList.add(invalid);
    } else {
        phoneNumber.classList.remove(invalid);
        phoneNumber.classList.add(valid);
    }
    
    let emailRegex = /^\w+@\w+(.[\w.]+)?$/;
    if (email.value != "" && !email.value.match(emailRegex)) {
        validBool = false;
        email.classList.remove(valid);
        email.classList.add(invalid);
    } else {
        email.classList.remove(invalid);
        email.classList.add(valid);
    }

    address.classList.add(valid);

    occupation.classList.add(valid);

    return validBool;
}

async function deleteContact() {
    let inData = {
        id: selected_id,
    };

    // To do after the response
    let callbacks = {};
    callbacks.error = function (response) {};
    callbacks.success = function (response) {
        location.reload();
    };

    // Send request
    let url = urlBase + "/deleteContact.php";
    sendRequest(inData, url, callbacks);

    return false;
}

async function searchContacts(params) {
    // the user that entered the data
    let cookieJson = readCookie();
    let userId = cookieJson.userId;
    let contactView = cookieJson.contactView;

    // Building Parameters
    let searchParams =
        params || /* document.getElementById("searchParams") || */ "";
    let inData = {
        userId: userId,
        search: searchParams,
    };

    let container = document.getElementById("contact_container");

    // To do after the response (nothing yet)
    let callbacks = {};
    callbacks.error = function (response) {
        container.innerHTML = "";
    };
    callbacks.success = function (response) {
        let tableHTML = "";
        container.innerHTML = "";
        if (contactView === "list") {
            tableHTML += 
            `<div id="table-container">
                <table id="contacts-table" class="table table-dark table-striped table-hover table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">First Name</th>
                                <th scope="col">Last Name</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Occupation</th>
                                <th scope="col">Email</th>
                                <th scope="col">Address</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>`
        }
        contacts = response;
        response.forEach((contact) => {
            // add the innerHTMLs
            let contactHTML;
            if (contactView === "card") {
                contactHTML = `
                <div class="contact">
                    <div class="contact-top">
                        <h3 class="name">${contact.firstName || ""} ${
                    contact.lastName || ""
                }</h3>
                        <div class="dropdown-center context-button-container">
                            <button class="context-button dropdown-toggle" type="button" data-bs-toggle="dropdown"></button>
                            <ul class="dropdown-menu">
                                <div class="dropdown-container">
                                    <button class="btn btn-primary dropdown-button dropdown-edit" data-bs-toggle="modal" data-bs-target="#editModal" onclick="selected_id=${contact.id};initEditPage();"><span class="material-icons-sharp">edit</span>Edit</button>
                                    <button class="btn btn-danger dropdown-button dropdown-delete" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="selected_id=${contact.id};initDeletePage();"><span class="material-icons-sharp">delete</span>Delete</button>
                                </div>
                            </ul>
                        </div>

                    </div>
                    <div class="contact-interior">
                        <img src="https://contactstorage.info/static/images/media/${
                            contact.imageUrl || "anonymous.png"
                        }" onerror="this.src='static/images/media/anonymous.png'"/>
                        <div class="contact-info">`;
    
                if (contact.phoneNumber)
                    contactHTML += `<div class="info_container"><span class="material-icons-sharp">call</span>${
                        formatPhoneNumber(contact.phoneNumber) || ""
                    }</div>`;
                if (contact.occupation)
                    contactHTML += `<div class="info_container"><span class="material-icons-outlined">work</span>${
                        contact.occupation || ""
                    }</div>`;
                if (contact.email)
                    contactHTML += `<div class="info_container"><span class="material-icons-outlined">email</span>${
                        contact.email || ""
                    }</div>`;
                if (contact.address)
                    contactHTML += `<div class="info_container"><span class="material-icons-sharp">home</span>${
                        contact.address || ""
                    }</div>`;
    
                contactHTML += `</div>
                    </div>
                </div>`;
    
                container.innerHTML += contactHTML;
            }
            else if (contactView === "list") {
                contactHTML = `
                <tr>
                    <td>${contact.firstName || ""}</td>
                    <td>${contact.lastName || ""}</td>
                    <td>${formatPhoneNumber(contact.phoneNumber) || ""}</td>
                    <td>${contact.occupation || ""}</td>
                    <td>${contact.email || ""}</td>
                    <td>${contact.address || ""}</td>
                    <td>
                        <div>
                            <button class="btn btn-primary" onclick="selected_id=${contact.id};pageView(true, 'edit');">Edit</button>
                            <button class="btn btn-danger" onclick="selected_id=${contact.id};pageView(true, 'delete');">Delete</button>
                        </div>
                    </td>
                </tr>`
            }
            tableHTML += contactHTML;
        });

        if (contactView === "list") {
            tableHTML += `
                    </tbody>
                </table>
            </div>`
            container.innerHTML = tableHTML;
        }
        else if (contactView === "card") {
            container.style.paddingBottom = "64px";
        }
    };

    // Send request
    let url = urlBase + "/searchContacts.php";
    await sendRequest(inData, url, callbacks);
}

function initCreatePage() {
    const firstName = document.getElementById(`create-firstName`);
    firstName.classList.remove("is-valid", "is-invalid");
    firstName.value = "";

    const lastName = document.getElementById(`create-lastName`);
    lastName.classList.remove("is-valid", "is-invalid");
    lastName.value = "";

    const phoneNumber = document.getElementById(`create-phoneNumber`);
    phoneNumber.classList.remove("is-valid", "is-invalid");
    phoneNumber.value = "";

    const email = document.getElementById(`create-email`);
    email.classList.remove("is-valid", "is-invalid");
    email.value = "";

    const address = document.getElementById(`create-address`);
    address.classList.remove("is-valid", "is-invalid");
    address.value = "";

    const occupation = document.getElementById(`create-occupation`);
    occupation.classList.remove("is-valid", "is-invalid");
    occupation.value = "";

    document.getElementById("create-picture").value = "";
}

function initEditPage() {
    const contact = contacts.find((contact) => contact.id === selected_id);

    const firstName = document.getElementById(`edit-firstName`);
    firstName.classList.remove("is-valid", "is-invalid");
    firstName.value = contact.firstName;

    const lastName = document.getElementById(`edit-lastName`);
    lastName.classList.remove("is-valid", "is-invalid");
    lastName.value = contact.lastName;

    const phoneNumber = document.getElementById(`edit-phoneNumber`);
    phoneNumber.classList.remove("is-valid", "is-invalid");
    phoneNumber.value = contact.phoneNumber;

    const email = document.getElementById(`edit-email`);
    email.classList.remove("is-valid", "is-invalid");
    email.value = contact.email;

    const address = document.getElementById(`edit-address`);
    address.classList.remove("is-valid", "is-invalid");
    address.value = contact.address;

    const occupation = document.getElementById(`edit-occupation`);
    occupation.classList.remove("is-valid", "is-invalid");
    occupation.value = contact.occupation;

    document.getElementById("edit-picture").value = "";
}

function initDeletePage() {
    const contact = contacts.find((contact) => contact.id === selected_id);
    document.getElementById(
        "delete_statement"
    ).innerHTML = `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`;
}

// NON-EVENT-RELATED

function formatPhoneNumber(string) {
    let cleaned = ("" + string).replace(/\D/g, "");

    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return string;
}

function phoneNumberToDigits(string) {
    let cleaned = ("" + string).replace(/\D/g, "");

    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return match[1] + match[2] + match[3];
    }
    return string;
}
