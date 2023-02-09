document.addEventListener('DOMContentLoaded', () => {
    searchContacts("");
}, false);

function editContact() {

}

function deleteContact() {

}

async function searchContacts(params) {

    // the user that entered the data
    let userId = readCookie().userId;

    // Building Parameters
    let searchParams = params || /* document.getElementById("searchParams") || */ "";
    let inData = {
        userId:userId,
        search:searchParams,
    }

    let container = document.getElementById("contact_container");

    // To do after the response (nothing yet)
    let callbacks = {}
    callbacks.error = function(response) {};
    callbacks.success = function(response) {
        container.innerHTML = '';
        response.forEach(contact => {
            // add the innerHTMLs

            container.innerHTML += `
            <div class="contact">
                <div class="contact-top">
                    <h3 class="name">${contact.firstName || ""} ${contact.lastName || ""}</h3>
                    <span class="material-icons-sharp context-button">more_vert</span>
                </div>
                <div class="contact-interior">
                    <img src="static/images/media/anonymous.png" />
                    <div class="contact-info">
                        <div class="info_container"><span class="material-icons-sharp">call</span>${formatPhoneNumber(contact.phoneNumber) || ""}</div>
                        <div class="info_container"><span class="material-icons-outlined">work</span>${contact.occupation || ""}</div>
                        <div class="info_container"><span class="material-icons-outlined">email</span>${contact.email || ""}</div>
                        <div class="info_container"><span class="material-icons-sharp">home</span>${contact.address || ""}</div>
                    </div>
                </div>
            </div>`
        });

        let context_buttons = document.querySelectorAll('.context-button');
        let context_menu = document.getElementById('contextmenu');
        console.log(context_buttons)
        for (let i = 0; i < context_buttons.length; i++) {
            context_buttons[i].addEventListener("click", function (event) { 
                const x = event.clientX + 5;
                const y = event.clientY + 5;

                context_menu.style.top = `${y}px`;
                context_menu.style.left = `${x}px`;

                context_menu.classList.remove('collapse');

                // If the menu goes offscreen
                if (!isInViewport(context_menu)) {
                    context_menu.style.left = `${context_menu.offsetLeft - context_menu.offsetWidth}px`;
                }

                setTimeout(() => {document.addEventListener('click', documentClickHandler);}, 0);
            });
        }
    };

    // Send request
    let url = urlBase + '/searchContacts.php';
    await sendRequest(inData, url, callbacks);
}

const documentClickHandler = function(e) {
    let context_menu = document.getElementById('contextmenu');
    let context_buttons = document.querySelectorAll('.context-button');
    const isClickedOutside = !(context_menu.contains(e.target) || contextButtonClick(e));
    if (isClickedOutside) {
        // Hide the menu
        context_menu.classList.add('collapse');

        // Remove the event handler
        document.removeEventListener('click', documentClickHandler);
    }
};

function contextButtonClick(event) {
    let context_buttons = document.querySelectorAll('.context-button');
    for (let i = 0; i < context_buttons.length; i++) {
        if (context_buttons[i].contains(event.target))
            return true;
    }
    return false;
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function formatPhoneNumber(string) {
    let cleaned = ('' + string).replace(/\D/g, '');

    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return string;
}
