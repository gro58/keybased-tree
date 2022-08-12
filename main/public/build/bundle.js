
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var bridge = (function (exports) {
    'use strict';

    var unit_replacement = "\\textcolor{blue}{";
    var htmloutput = "true";
    var config = {
    	unit_replacement: unit_replacement,
    	htmloutput: htmloutput
    };

    /**
     * 
     * @param {*} tree - tree to be trafersed
     * @param {*} currentNode - current node while recursing
     * @param {*} callbackEntering - callback function called before entering the current node
     * @param {*} callbackLeaving - callback function called after leaving the current node
     * @param {*} level - counts recursion level, may be used by callback functions
     */
    function recurseNode(tree, currentNode, callbackEntering, callbackLeaving, level) {
        callbackEntering(level, currentNode);
        if (currentNode.children) {
            var num_of_children = currentNode.children.length;
            level++;
            for (var i = 0; i < num_of_children; i++) {
                var childKey = currentNode.children[i];
                var child = tree[childKey];
                recurseNode(tree, child, callbackEntering, callbackLeaving, level);
            }
            level--;
        }
        callbackLeaving(level, currentNode);
    }

    /**
     * 
     * @param {*} tree -  keybased tree object
     * @param {*} callback - function callbackEntering(level, currentNode)
     * called when entering current node
     */
    function traverseRootToLeafs(tree, callback) {
        var emptyFunc = function () {};
        var currentNode = tree['root'];
        recurseNode(tree, currentNode, callback, emptyFunc, 0);
    }

    /**
     * default node structure
     * @param {string|*} content - the content of the new created node, maybe a string or an object
     * parent and children are represented by their keys or array of keys
     * use of keys is preferred to use of references to parent nodes or child nodes
     * use of keys avoids problems with e.g. circular dependencies if using JSON.stringify
     */
    function node(content) {
        this.parentKey = null;
        this.children = [];
        this.isLeaf = (this.children.length === 0);
        this.content = content;
        this.key = 'dummy key'; //overwritten in createTree
    }

    // variable tree has to be outside of createTree to have access to createNode
    var tree = {
        'root': new node('dummy rootcontent'), //overwritten in createTree
        addNode: function (parentKey, newContent) {
            return createNode(this, parentKey, newContent);
        },
        /**
         * 
         * @param {function(level, currentNode)} callback - function applied to current node while traversing the tree
         */
        fromRootToLeaf: function(callback){
            traverseRootToLeafs(this, callback);
        }
    };

    /**
     * creates a tree object with one node: the root node
     * @param {*} rootcontent - the content of the new root node
     * @returns tree object consisting of root node 
     */
    function createTree(rootcontent){
        var newTree = Object.create(tree);
        newTree.root.content = rootcontent;
        newTree.root.key = 'root';
        return newTree;
    }

    /**
     * 
     * @param {*} tree - tree to which node will be added
     * @param {*} parentKey - key of parent of the new node
     * @param {*} newContent - content of the new node
     * @returns the new node or null, if parent key not found in tree
     */
    function createNode(tree, parentKey, newContent) {
        // console.log('add node with content ' + newContent + ' to parent with key ' + parentKey);
        var parent = tree[parentKey];
        if (parent) {
            var newKey = randomKey(6);
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

    /* eslint-disable no-unused-vars */

    /**
     * create a tree for test purposes (e.g. traversing)
     * using addNode
     */
    function demoTree() {
        var tree = createTree('Demo Tree');
        var w = tree.addNode("root", "content-W");
        var y = tree.addNode("root", "content-Y");
        tree.addNode(w.key, "content-A");
        var s = tree.addNode(w.key, "content-S");
        tree.addNode(w.key, "content-E");
        tree.addNode(s.key, "content-T");
        tree.addNode(y.key, "content-A");
        tree.addNode(y.key, "content-C");
        return tree;
    }

    var version = "0.0.42";

    window.onload = function () {
        console.log('version (from package.json) ', version);
        // var newTree = demoTree();
        // console.log(newTree);
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
