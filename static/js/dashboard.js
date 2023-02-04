document.addEventListener('DOMContentLoaded', function() 
{
    readCookie();

    let listItems = document.querySelectorAll('.sidebar > ul > li');
    for (let i = 0; i < listItems.length; i++) {
        listItems[i].addEventListener('click', function() {
            document.querySelector(".sidebar > ul > li.active").classList.remove('active');
            this.classList.add('active');
        });
    };

    document.getElementById("hamburger").addEventListener('click', function () {
        let sidebar = document.getElementById('side_nav')
        let collapsableElements = document.getElementsByClassName('collapsable');

        if (this.classList.contains('close-btn')) {
            for (let element of collapsableElements) {
                element.classList.add("collapse");
            }
            sidebar.classList.remove("active");
            this.classList.remove('close-btn');
            this.classList.add('open-btn');
        }
        else if (this.classList.contains('open-btn')) {
            sidebar.classList.add("active");
            for (let element of collapsableElements) {
                element.classList.remove("collapse");
            }
            this.classList.remove('open-btn');
            this.classList.add('close-btn');
        }
    });
}, false);
