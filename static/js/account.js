let user;

document.addEventListener("DOMContentLoaded", () => {
    let exit_buttons = document.querySelectorAll(".exit-page");
    exit_buttons.forEach((button) => {
        button.addEventListener("click", () => {
            pageView(false);
        });
    });

    // Listener for color 1
    const colorButton1 = document.getElementById("color-button-1");
    const colorText1 = document.getElementById("color-text-1");

    // makes sure the text and button values are the same
    colorButton1.addEventListener("change", () => {
        colorText1.value = colorButton1.value;
    });

    colorText1.addEventListener("keyup", () => {
        colorButton1.value = colorText1.value;
    });

    // Listener for color 2
    const colorButton2 = document.getElementById("color-button-2");
    const colorText2 = document.getElementById("color-text-2");

    // makes sure the text and button values are the same
    colorButton2.addEventListener("change", () => {
        colorText2.value = colorButton2.value;
    });

    colorText2.addEventListener("keyup", () => {
        colorButton2.value = colorText2.value;
    });
});

async function retrieveUser() {
    let userId = readCookie().userId;

    let inData = {
        userId: userId,
    };

    let callbacks = {};
    callbacks.error = function (response) {};
    callbacks.success = function (response) {
        user = response;

        document.getElementById("userFirstLast").innerHTML =
            user.firstName + " " + user.lastName;
        document.getElementById("userEmail").innerHTML = user.email || "";
    };

    // Send request
    let url = urlBase + "/retrieveUser.php";
    await sendRequest(inData, url, callbacks);
}

function pageView(show = true, page = "details") {
    let overlay = document.getElementById("page-overlay");
    if (show) {
        let priority;

        if (page.includes("details")) {
            priority = document.getElementById("details-page");
        } else if (page.includes("settings")) {
            priority = document.getElementById("settings-page");
        } else if (page.includes("delete")) {
            priority = document.getElementById("delete-page");
        } else return;

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
