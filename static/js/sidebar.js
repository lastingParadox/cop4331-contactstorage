document.addEventListener("DOMContentLoaded", function () {
    let cookie = readCookie();

    document.body.style.backgroundColor = colorDash;

    let root = document.querySelector(":root");
    let sidebar = document.getElementById("side_nav");

    sidebar.style.backgroundColor = colorSide;

    let brightnessArray = getBrightness(hexToRGB(colorSide));
    root.style.setProperty("--sidebar-text-color", brightnessArray[0]);
    root.style.setProperty("--sidebar-selected-color", brightnessArray[1]);

    let hamburger = document.getElementById("hamburger");

    if (cookie.side_nav == "active") {
        sidebar.classList.add("active");
        hamburger.classList.remove("open-btn");
        hamburger.classList.add("close-btn");
    } else if (cookie.side_nav == "inactive") {
        sidebar.classList.remove("active");
        hamburger.classList.remove("close-btn");
        hamburger.classList.add("open-btn");
    }

    let listItems = document.querySelectorAll(".sidebar > ul > li");
    for (let i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener("click", function () {
            document
                .querySelector(".sidebar > ul > li.active")
                .classList.remove("active");
            this.classList.add("active");
        });
    }

    hamburger.addEventListener("click", function () {
        let collapsableElements =
            document.getElementsByClassName("collapsable");

        if (this.classList.contains("close-btn")) {
            for (let element of collapsableElements) {
                element.classList.add("collapse");
            }
            sidebar.classList.remove("active");
            this.classList.remove("close-btn");
            this.classList.add("open-btn");
        } else if (this.classList.contains("open-btn")) {
            sidebar.classList.add("active");
            for (let element of collapsableElements) {
                element.classList.remove("collapse");
            }
            this.classList.remove("open-btn");
            this.classList.add("close-btn");
        }
    });

    // Adds the animation after the page loads
    setTimeout(() => {
        sidebar.style.transition = "all 0.2s";
    }, 0);
});

function transferPage(id) {
    let sidebar = document.getElementById("side_nav");

    if (sidebar.classList.contains("active")) setCookie("side_nav", "active");
    else setCookie("side_nav", "inactive");

    switch (id) {
        case "nav_contacts":
            window.location.href = "./dashboard.html";
            break;
        case "nav_account":
            window.location.href = "./account.html";
            break;
        default:
            return;
    }
}

function hexToRGB(hexString) {
    hexString = hexString.split("#")[1];
    let rgbHex = hexString.match(/.{1,2}/g);
    let rgb = [
        parseInt(rgbHex[0], 16),
        parseInt(rgbHex[1], 16),
        parseInt(rgbHex[2], 16),
    ];

    return rgb;
}

function getBrightness(rgbArray) {
    const brightness = Math.round(
        (rgbArray[0] * 299 + rgbArray[1] * 587 + rgbArray[2] * 114) / 1000
    );

    let brightnessArray = [];

    brightnessArray[0] = brightness > 125 ? "#000000" : "#FFFFFF";

    if (brightnessArray[0] === "#000000") brightnessArray[1] = "#FFFFFF";
    else brightnessArray[1] = "#000000";

    return brightnessArray;
}
