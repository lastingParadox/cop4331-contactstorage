let user;

document.addEventListener("DOMContentLoaded", () => {
    let root = document.querySelector(":root");
    let sidebar = document.getElementById("side_nav");

    let exit_buttons = document.querySelectorAll(".exit-page");
    exit_buttons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.id === "settings-exit") {
                document.body.style.backgroundColor = colorDash;
                sidebar.style.backgroundColor = colorSide;

                let brightnessArray = getBrightness(hexToRGB(colorSide));
                root.style.setProperty(
                    "--sidebar-text-color",
                    brightnessArray[0]
                );
                root.style.setProperty(
                    "--sidebar-selected-color",
                    brightnessArray[1]
                );
            }
            pageView(false);
        });
    });

    // Listener for color 1
    const colorButton1 = document.getElementById("color-button-1");
    const colorText1 = document.getElementById("color-text-1");

    // makes sure the text and button values are the same
    colorButton1.addEventListener("change", () => {
        colorText1.value = colorButton1.value;
        document.body.style.backgroundColor = colorButton1.value;
    });

    colorText1.addEventListener("keyup", () => {
        colorButton1.value = colorText1.value;
        document.body.style.backgroundColor = colorText1.value;
    });

    // Listener for color 2
    const colorButton2 = document.getElementById("color-button-2");
    const colorText2 = document.getElementById("color-text-2");

    // makes sure the text and button values are the same
    colorButton2.addEventListener("change", () => {
        colorText2.value = colorButton2.value;
        sidebar.style.backgroundColor = colorButton2.value;
        let brightnessArray = getBrightness(hexToRGB(colorButton2.value));
        root.style.setProperty("--sidebar-text-color", brightnessArray[0]);
        root.style.setProperty("--sidebar-selected-color", brightnessArray[1]);
    });

    colorText2.addEventListener("keyup", () => {
        colorButton2.value = colorText2.value;
        sidebar.style.backgroundColor = colorText2.value;
        let brightnessArray = getBrightness(hexToRGB(colorText2.value));
        root.style.setProperty("--sidebar-text-color", brightnessArray[0]);
        root.style.setProperty("--sidebar-selected-color", brightnessArray[1]);
    });

    document.getElementById("default_dash").onclick = () => {
        colorText1.value = "#0077b6";
        colorButton1.value = "#0077b6";
        document.body.style.backgroundColor = colorText1.value;
    };

    document.getElementById("default_side").onclick = () => {
        colorText2.value = "#000000";
        colorButton2.value = "#000000";
        sidebar.style.backgroundColor = colorText2.value;
        let brightnessArray = getBrightness(hexToRGB(colorText2.value));
        root.style.setProperty("--sidebar-text-color", brightnessArray[0]);
        root.style.setProperty("--sidebar-selected-color", brightnessArray[1]);
    };

    retrieveUser();
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
        document.getElementById(
            "userPhoto"
        ).src = `https://contactstorage.info/static/images/media/${
            user.imageUrl || "anonymous.png"
        }`;

        // Details Form
        document.getElementById("details-firstName").value = user.firstName;
        document.getElementById("details-lastName").value = user.lastName;
        document.getElementById("details-username").value = user.username;
        document.getElementById("details-email").value = user.email;

        // Settings Form
        document.getElementById("color-button-1").value = user.colorDash;
        document.getElementById("color-text-1").value = user.colorDash;

        document.getElementById("color-button-2").value = user.colorSide;
        document.getElementById("color-text-2").value = user.colorSide;

        if (user.contactView === "card")
            document.getElementById("flexSwitchCheckChecked").checked = true;
        else document.getElementById("flexSwitchCheckChecked").checked = false;
    };

    // Send request
    let url = urlBase + "/retrieveUser.php";
    await sendRequest(inData, url, callbacks);
}

function editUserDetails(clearBool = false) {
    let userId = readCookie().userId;

    let inData = {
        userId: userId, // id of the sender
        firstName: document.getElementById("details-firstName").value, // required
        lastName: document.getElementById("details-lastName").value,
        username: document.getElementById("details-username").value,
        //password: document.getElementById("details-newpassword").value || null,
        email: document.getElementById("details-email").value,
        imageUrl: null,
    };

    let editCallbacks = {};
    editCallbacks.error = function (response) {};
    editCallbacks.success = function (response) {
        location.reload();
    };

    if (!clearBool) {
        let photo = document.getElementById("details-picture").files[0];
        if (photo) {
            let formData = new FormData();
            let filename = `user_${userId}.png`;
            formData.append("picture", photo, filename);

            let url = urlBase + "/fileupload.php";

            let callbacks = {};
            callbacks.error = function (response) {
                sendRequest(
                    inData,
                    urlBase + "/editUserDetails.php",
                    editCallbacks
                );
            };
            callbacks.success = function (response) {
                inData.imageUrl = filename;
                sendRequest(
                    inData,
                    urlBase + "/editUserDetails.php",
                    editCallbacks
                );
            };

            sendRequest(formData, url, callbacks);
            return false;
        }
    } else inData.imageUrl = "null";

    sendRequest(inData, urlBase + "/editUserDetails.php", editCallbacks);

    return false; // disable reload
}

function editUserSettings() {
    let userId = readCookie().userId;

    let inData = {
        userId: userId, // id of the sender
        colorDash: document.getElementById("color-text-1").value, // required
        colorSide: document.getElementById("color-text-2").value,
        username: document.getElementById("details-username").value,
    };

    if (document.getElementById("flexSwitchCheckChecked").checked) {
        inData.contactView = "card";
    } else {
        inData.contactView = "list";
    }

    let url = urlBase + "/editUserSettings.php";
    let callbacks = {};

    callbacks.success = function (response) {
        console.log(`\n${response}\n`);
        setCookie("colorDash", response.colorDash);
        setCookie("colorSide", response.colorSide);
        setCookie("contactView", response.contactView);
        location.reload();
    };
    callbacks.error = function (response) {};

    sendRequest(inData, url, callbacks);
    return false;
}

function deleteUserAccount() {
    console.log("Sdfsjhdekflp")
    let userId = readCookie().userId;
    console.log("sdfahsjkedf")
    let inData = {
        userId: userId,
    }

    let url = urlBase + "/deleteUser.php";
    let callbacks = {};

    sendRequest(inData, url, callbacks);
    callbacks.success = function (response) {
        window.location.href = "./index.html";
    }

    return false;
}

function pageView(show = true, page = "details") {
    let overlay = document.getElementById("page-overlay");
    if (show) {
        let priority;

        if (page.includes("details")) {
            priority = document.getElementById("details-page");
        } else if (page.includes("settings")) {
            priority = document.getElementById("settings-page");
            document.getElementById("color-button-1").value = colorDash;
            document.getElementById("color-text-1").value = colorDash;
            document.getElementById("color-button-2").value = colorSide;
            document.getElementById("color-text-2").value = colorSide;
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
