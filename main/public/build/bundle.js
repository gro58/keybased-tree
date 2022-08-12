
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var bridge = (function (exports) {
    'use strict';

    var unit_replacement = "\\textcolor{blue}{";
    var htmloutput = "true";
    var config = {
    	unit_replacement: unit_replacement,
    	htmloutput: htmloutput
    };

    var version = "0.0.32";

    /**
     * 
     * @param {*} content 
     * default node structure
     * parent and children are represented by their keys or array of keys
     * use of keys is preferred to use of references to parent nodes or child nodes
     * use of keys avoids problems with e.g. circular dependencies if using JSON.stringify
     */
    function node(content) {
        this.parentKey = null;
        this.children = [];
        this.isLeaf = (this.children.length === 0);
        this.content = content;
    }

    // variable tree has to be outside of createTree to have access to createNode
    var tree = {
        'root': new node('rootcontent'),
        addNode: function (parentKey, newContent) {
            return createNode(this, parentKey, newContent);
        }
    };

    function createTree(rootcontent){
        var newTree = Object.create(tree);
        newTree.root.content = rootcontent;
        return newTree;
    }

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

    /**
     * create a tree for test purposes (e.g. traversing)
     * using addNode
     */
    function demoTree() {
        var tree = createTree('Demo Tree');
        var w = tree.addNode("root", "content-W");
        tree.addNode("root", "content-Y");
        tree.addNode(w.key, "content-R");
        var s = tree.addNode(w.key, "content-S");
        tree.addNode(w.key, "content-E");
        tree.addNode(s.key, "content-T");
        return tree;
    }

    window.onload = function () {
        // console.log('version (from package.json) ', version);
        var newTree = demoTree();
        console.log(newTree);
    };

    function mainIsLoaded() {
        return true;
    }

    exports.config = config;
    exports.createTree = createTree;
    exports.demoTree = demoTree;
    exports.mainIsLoaded = mainIsLoaded;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
