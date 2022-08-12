var bridge = (function (exports) {
    'use strict';

    var unit_replacement = "\\textcolor{blue}{";
    var htmloutput = "true";
    var config = {
    	unit_replacement: unit_replacement,
    	htmloutput: htmloutput
    };

    var version = "0.0.29";

    exports.tree = void 0;

    function node(content) {
        this.parentKey = null;
        this.children = [];
        this.isLeaf = (this.children.length === 0);
        this.content = content;
    }

    exports.tree = {
        'root': new node('rootcontent'),
        addNode: function (parentKey, newContent) {
            return createNode(this, parentKey, newContent);
        }
    };

    function createNode(tree, parentKey, newContent) {
        // console.log('add node with content ' + newContent + ' to parent with key ' + parentKey);
        var parent = tree[parentKey];
        if (parent) {
            var newKey = randomKey(10);
            var newNode = {
                key: newKey,
                content: newContent,
                parentKey: parentKey
            };
            tree[newKey] = newNode;
            parent.children = [...(parent.children || []), newNode.key];
            return newNode;
        } else {
            console.log('unknown parent key: ', parentKey);
            return null;
        }
    }
    // console.log(tree);

    function randomKey(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        var numOfChars = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * numOfChars));
        }
        return result;
    }

    window.onload = function () {
        console.log('version (from package.json) ', version);
    };

    function mainIsLoaded() {
        return true;
    }

    exports.config = config;
    exports.mainIsLoaded = mainIsLoaded;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
