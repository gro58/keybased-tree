// https://stackoverflow.com/questions/51374649/using-async-functions-to-await-user-input-from-onclick
export var waitforClickModule = (function () {
    var buttonElement, classList, outputElement;

    function isClicked() {
        return classList.contains('clicked');
    }

    const timeout = async ms => new Promise(res => setTimeout(res, ms));

    return {
        setButtonId: function (buttonElementId) {
            buttonElement = document.getElementById(buttonElementId);
            classList = buttonElement.classList;
            // eslint-disable-next-line no-unused-vars
            buttonElement.onclick = function clickEventHandler(ev) {
                classList.add('clicked');
            }
        },
        setOutputElementId: function (outputElementId) {
            outputElement = document.getElementById(outputElementId);
        },
        waitForClick: async function () {
            // pauses script
            while (isClicked() === false) {
                await timeout(50);
                // console.log('waiting');
            }
            // console.log('clicked');
            classList.remove('clicked'); // reset var
        },
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
