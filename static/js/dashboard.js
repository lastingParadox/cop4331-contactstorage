let selected_id = 0;
let contextmenu_width = 0;
let contacts;

document.addEventListener(
    "DOMContentLoaded",
    () => {
        let context_menu = document.getElementById("contextmenu");
        contextmenu_width = context_menu.offsetWidth;
        context_menu.classList.add("collapse");

        document
            .getElementById("contextmenu-edit")
            .addEventListener("click", () => {
                context_menu.classList.add("collapse");
                pageView(true, "edit");
            });
        document
            .getElementById("contextmenu-delete")
            .addEventListener("click", () => {
                context_menu.classList.add("collapse");
                pageView(true, "delete");
            });

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
    createCallbacks.error = function(response) {};
    createCallbacks.success = function(response) { location.reload(); }

    let photo = document.getElementById("create-picture").files[0];
    if (photo) {
        let formData = new FormData();
        let filename = `user_${userId}_contact_${selected_id}.png`
        formData.append("picture", photo, filename);

        let url = urlBase + "/fileupload.php";
        
        let callbacks = {};
        callbacks.error = function (response) {
            sendRequest(inData, urlBase + "/createContact.php", createCallbacks);
        };
        callbacks.success = function (response) { 
            inData.imageUrl = filename;
            console.log(inData.imageUrl);
            sendRequest(inData, urlBase + "/createContact.php", createCallbacks);
        };

        sendRequest(formData, url, callbacks);
    }
    else sendRequest(inData, urlBase + "/createContact.php", createCallbacks);

    return false; // disable reload
}

function editContact(clearBool=false) {

    let userId = readCookie().userId;

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
        imageUrl: null,
    };

    let editCallbacks = {};
    editCallbacks.error = function(response) {};
    editCallbacks.success = function(response) { location.reload(); }

    if (!clearBool) {
        let photo = document.getElementById("edit-picture").files[0];
        if (photo) {
            let formData = new FormData();
            let filename = `user_${userId}_contact_${selected_id}.png`
            formData.append("picture", photo, filename);

            let url = urlBase + "/fileupload.php";
            
            let callbacks = {};
            callbacks.error = function (response) {
                sendRequest(inData, urlBase + "/editContact.php", editCallbacks);
            };
            callbacks.success = function (response) { 
                inData.imageUrl = filename;
                console.log(inData.imageUrl);
                sendRequest(inData, urlBase + "/editContact.php", editCallbacks);
            };

            sendRequest(formData, url, callbacks);
            return false;
        }
    }
    else inData.imageUrl = "null";

    sendRequest(inData, urlBase + "/editContact.php", editCallbacks);

    return false; // disable reload
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
    let userId = readCookie().userId;

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
    callbacks.error = function (response) {};
    callbacks.success = function (response) {
        contacts = response;
        container.innerHTML = "";
        response.forEach((contact) => {
            // add the innerHTMLs

            container.innerHTML += `
            <div class="contact">
                <div class="contact-top">
                    <h3 class="name">${contact.firstName || ""} ${
                        contact.lastName || ""
                    }</h3>
                    <span class="material-icons-sharp context-button" data-id="${
                        contact.id
                    }">more_vert</span>
                </div>
                <div class="contact-interior">
                    <img src="https://contactstorage.info/static/images/media/${contact.imageUrl || "anonymous.png"}" onerror="this.src='static/images/media/anonymous.png'"/>
                    <div class="contact-info">
                        <div class="info_container"><span class="material-icons-sharp">call</span>${
                            formatPhoneNumber(contact.phoneNumber) || ""
                        }</div>
                        <div class="info_container"><span class="material-icons-outlined">work</span>${
                            contact.occupation || ""
                        }</div>
                        <div class="info_container"><span class="material-icons-outlined">email</span>${
                            contact.email || ""
                        }</div>
                        <div class="info_container"><span class="material-icons-sharp">home</span>${
                            contact.address || ""
                        }</div>
                    </div>
                </div>
            </div>`;
        });

        let context_buttons = document.querySelectorAll(".context-button");
        let context_menu = document.getElementById("contextmenu");
        console.log(context_buttons);
        for (let i = 0; i < context_buttons.length; i++) {
            context_buttons[i].addEventListener("click", function (event) {
                selected_id = parseInt(context_buttons[i].dataset.id);
                console.log(selected_id);
                let rect = context_buttons[i].getBoundingClientRect();

                const xCenter = (rect.left + rect.right) / 2;
                const x = event.clientX + 5;

                context_menu.style.top = `${rect.bottom}px`;
                context_menu.style.left = `${
                    xCenter - contextmenu_width / 2
                }px`;

                context_menu.classList.remove("collapse");

                // If the menu goes offscreen
                if (!isInViewport(context_menu)) {
                    context_menu.style.left = `${
                        context_menu.offsetLeft - context_menu.offsetWidth
                    }px`;
                }

                setTimeout(() => {
                    document.addEventListener("click", documentClickHandler);
                }, 0);
            });
        }
    };

    // Send request
    let url = urlBase + "/searchContacts.php";
    await sendRequest(inData, url, callbacks);
}

const documentClickHandler = function (e) {
    let context_menu = document.getElementById("contextmenu");
    const isClickedOutside = !(
        context_menu.contains(e.target) || contextButtonClick(e)
    );
    if (isClickedOutside) {
        // Hide the menu
        context_menu.classList.add("collapse");

        // Remove the event handler
        document.removeEventListener("click", documentClickHandler);
    }
};

function contextButtonClick(event) {
    let context_buttons = document.querySelectorAll(".context-button");
    for (let i = 0; i < context_buttons.length; i++) {
        if (context_buttons[i].contains(event.target)) return true;
    }
    return false;
}

function pageView(show = true, page = "edit") {
    let overlay = document.getElementById("page-overlay");
    if (show) {
        let priority;

        if (page.includes("edit")) {
            priority = document.getElementById("edit-page");
            initEditPage();
        } else if (page.includes("delete")) {
            priority = document.getElementById("delete-page");
            initDeletePage();
        } else if (page.includes("create")) {
            priority = document.getElementById("create-page");
            initCreatePage();
        } else return;

        priority.dataset.id = selected_id;

        overlay.classList.remove("collapse");
        priority.classList.remove("collapse");
    } else {
        let pages = document.querySelectorAll(".page");
        overlay.classList.add("collapse");
        for (let page of pages) {
            page.classList.add("collapse");
        }
    }
}

function initCreatePage() {
    document.getElementById("create-firstName").value = "";
    document.getElementById("create-lastName").value = "";
    document.getElementById("create-phoneNumber").value = "";
    document.getElementById("create-email").value = "";
    document.getElementById("create-occupation").value = "";
    document.getElementById("create-address").value = "";
    document.getElementById("create-picture").value = "";
}

function initEditPage() {
    const contact = contacts.find((contact) => contact.id === selected_id);
    document.getElementById("edit-firstName").value = contact.firstName;
    document.getElementById("edit-lastName").value = contact.lastName;
    document.getElementById("edit-phoneNumber").value = contact.phoneNumber;
    document.getElementById("edit-email").value = contact.email;
    document.getElementById("edit-address").value = contact.address;
    document.getElementById("edit-occupation").value = contact.occupation;
    document.getElementById("edit-picture").value = "";
}

function initDeletePage() {
    const contact = contacts.find((contact) => contact.id === selected_id);
    document.getElementById(
        "delete_statement"
    ).innerHTML = `Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`;
}

// NON-EVENT-RELATED

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
            (window.innerWidth || document.documentElement.clientWidth)
    );
}

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
