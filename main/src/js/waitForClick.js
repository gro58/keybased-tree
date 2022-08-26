// https://stackoverflow.com/questions/51374649/using-async-functions-to-await-user-input-from-onclick
export var waitforClickModule = (function () {
    var clicked = false;
    var buttonElement, outputElement;

    const timeout = async ms => new Promise(res => setTimeout(res, ms));

    return {
        setButtonId: function (buttonElementId) {
            buttonElement = document.getElementById(buttonElementId);
            // eslint-disable-next-line no-unused-vars
            buttonElement.onclick = function clickEventHandler(ev) {
                clicked = true;
            }
        },
        waitForClick: async function () {
            // pauses script
            while (clicked === false) {
                await timeout(50);
                // console.log('waiting');
            }
            // console.log('clicked');
            clicked = false; // reset var
        },
        // necessary only for demo
        setOutputElementId: function (outputElementId) {
            outputElement = document.getElementById(outputElementId);
        },
        // optional
        demo: async function () {
            var i = 0;
            while (i <= 2) {
                outputElement.innerHTML = i;
                await this.waitForClick();
                i++;
            }
            // next lines cannot be placed after demo()!
            outputElement.innerHTML = 'End';
            console.log(buttonElement.style.display);
            buttonElement.style.display = 'none';
        }
    }
})();

// usage:
// waitforClickModule.setButtonId('myButton');
// waitforClickModule.setOutputElementId('out');
// waitforClickModule.demo();
