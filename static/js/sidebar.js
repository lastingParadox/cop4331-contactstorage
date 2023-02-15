document.addEventListener("DOMContentLoaded", function () {
    let cookie = readCookie();

    let sidebar = document.getElementById("side_nav");
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
        case "nav_settings":
            window.location.href = "./settings.html";
            break;
        default:
            return;
    }
}
