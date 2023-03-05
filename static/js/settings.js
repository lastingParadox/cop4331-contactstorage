document.addEventListener('DOMContentLoaded', () => {

    // Listener for color 1
    {
        const colorButton = document.getElementById('color-button-1');
        const colorText = document.getElementById('color-text-1');

        // makes sure the text and button values are the same
        colorButton.addEventListener('change', () => {
            colorText.value = colorButton.value;
        });

        colorText.addEventListener('keyup', () => {
            colorButton.value = colorText.value;
        });
    }

    // Listener for color 2
    {
        const colorButton = document.getElementById('color-button-2');
        const colorText = document.getElementById('color-text-2');

        // makes sure the text and button values are the same
        colorButton.addEventListener('change', () => {
            colorText.value = colorButton.value;
        });

        colorText.addEventListener('keyup', () => {
            colorButton.value = colorText.value;
        });
    }

});