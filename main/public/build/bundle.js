var bridge = (function (exports) {
    'use strict';

    var unit_replacement = "\\textcolor{blue}{";
    var htmloutput = "true";
    var config = {
    	unit_replacement: unit_replacement,
    	htmloutput: htmloutput
    };

    // window.onload = function () {
    //     preparePage();
    // };

    function mainIsLoaded() {
        return true;
    }

    exports.config = config;
    exports.mainIsLoaded = mainIsLoaded;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
