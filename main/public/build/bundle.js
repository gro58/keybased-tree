
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
     * Code for traversing: 
     * https://code.tutsplus.com/articles/data-structures-with-javascript-tree--cms-23393 
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
     * 
     * @param {*} tree -  keybased tree object
     * @param {*} callback - function callbackLeaving(level, currentNode)
     * called when leaving current node
     */
     function traverseLeafsToRoot(tree, callback) {
        var emptyFunc = function () {};
        // var emptyFunc = null; //causes TypeError
        var currentNode = tree['root'];
        recurseNode(tree, currentNode, emptyFunc, callback, 0);
    }

    // variable tree has to be definde outside of createTree to have access to createNode
    var tree = {
        addNode: function (parentKey, newContent) {
            if (parentKey) {
                return createNode(this, parentKey, newContent);
            } else {
                console.error('parentKey undefined or null');
                return undefined;
            }
        },
        /**
         * 
         * @param {function(level, currentNode)} callback - function applied to current node while traversing the tree
         */
        fromRootToLeafs: function (callback) {
            traverseRootToLeafs(this, callback);
        },
        /**
         * 
         * @param {function(level, currentNode)} callback - function applied to current node while traversing the tree
         */
        fromLeafsToRoot: function (callback) {
            traverseLeafsToRoot(this, callback);
        },
        remove: function(key){
            var node = removeNode(this, key);
            if (typeof node === 'undefined'){
                node = '- no node';
            }
            return node;
        }
    };

    /**
     * creates a tree object with one node: the root node
     * @param {*} rootcontent - the content of the new root node
     * @returns tree object consisting of root node 
     */
    function createTree(rootcontent) {
        // newTree inherits methods of tree object 
        var newTree = Object.create(tree);
        var rootNode = {
            key: 'root',
            parentKey: null,
            children: [],
            content: rootcontent,
            isLeaf: function () {
                return (this.children.length === 0);
            }
        };
        newTree['root'] = rootNode;
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
        var parent = tree[parentKey];
        if (parent) {
            var newKey = nonexistingRandomKey(tree, 3);
            var newNode = {
                key: newKey,
                parentKey: parentKey,
                children: [],
                content: newContent,
                isLeaf: function () {
                    return (this.children.length === 0);
                }
            };
            tree[newKey] = newNode;
            parent.children = [...(parent.children || []), newNode.key];
            return newNode;
        } else {
            console.log('unknown parent key: ', parentKey);
            return undefined;
        }
    }

    function removeNode(tree, key) {
        var node = tree[key];
        if (node) {
            console.log(node.key,'has children',node.children);
            // TODO necessary? if(node.children && node.children.length > 0){}
            switch (node.children.length) {
                case 0:
                    // no children
                    var parent = tree[node.parentKey];
                    if (parent) {
                        var childIndex = parent.children.indexOf(key);
                        // remove key from array of children of parent
                        parent.children.splice(childIndex);
                        var node_clone = JSON.parse(JSON.stringify(node));
                        delete tree[key];
                        return node_clone;
                    } else {
                        console.log('root cannot be removed');
                    }
                    return node;
                case 1:
                    // exactly one child
                    console.log('remove node with one child - not yet implemented');
                    break;
                default:
                    // more than one child
                    console.log('node with more than one child cannot be removed');
            }
            // console.log(tree);

        } else {
            console.log('node with key', key, 'does not exist');
            return undefined;
        }
    }

    /**
     * 
     * @param {*} length - length of key to be generated
     * @returns {string} - consists of chars randomly picked from 'characters'
     */
    function randomKey(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        // var characters = 'abc'; //for test
        var numOfChars = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * numOfChars));
        }
        return result;
    }

    function nonexistingRandomKey(tree, length) {
        const numOfTries = 10;
        // const numOfTries = 5; // for test
        var existingKeys = Object.keys(tree);
        // console.log('existingKeys', existingKeys);
        var newKey = null;
        for (var i = 0; i < numOfTries; i++) {
            var candidate = randomKey(length);
            if (existingKeys.indexOf(candidate) === -1) {
                // candidate is no existing key
                newKey = candidate;
                i = numOfTries; // short circuit
            } else {
                // no new key found; try again
                console.log('try number', i, 'not successful:', candidate, 'exists');
            }
        }
        if (newKey === null) {
            throw 'no new key found';
        }
        return newKey;
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
        tree.addNode(w.key, "content-R");
        // var a1 = tree.addNode(w.key, "content-A"); //for demo: double content is allowed
        var s = tree.addNode(w.key, "content-S");
        var e = tree.addNode(w.key, "content-E");
        tree.addNode(s.key, "content-T");
        tree.addNode(y.key, "content-A");
        tree.addNode(y.key, "content-C");
        // removing nodes -testcase
        var removedNode;
        removedNode = tree.remove('dummy-key');
        console.log('removed', removedNode);
        removedNode = tree.remove(s.key);
        console.log('removed', removedNode);
        removedNode = tree.remove(e.key);
        console.log('removed', removedNode);
        removedNode = tree.remove('root');
        console.log('removed', removedNode);
        removedNode = tree.remove(y.key);
        console.log('removed', removedNode);
        return tree;
    }

    var version = "0.0.48";

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
