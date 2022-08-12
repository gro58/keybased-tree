var bridge = (function (exports) {
    'use strict';

    var unit_replacement = "\\textcolor{blue}{";
    var htmloutput = "true";
    var config = {
    	unit_replacement: unit_replacement,
    	htmloutput: htmloutput
    };

    var version = "0.0.26";

    function node(content){
        this.parentKey = null;
        this.children = [];
        this.isLeaf = (this.children.length === 0);
        this.content = content;
    }

    var tree = {
        'root': new node('rootcontent')
    };

    console.log(tree);

    // tree.Prototype.addNode= function(parentKey){
    //     console.log('add node to ', parentKey);
    // }

    window.onload = function () {
        console.log('version (from package.json) ', version);
    };

    function mainIsLoaded() {
        return true;
    }

    exports.config = config;
    exports.mainIsLoaded = mainIsLoaded;
    exports.tree = tree;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
