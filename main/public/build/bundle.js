
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
     * @param {*} callback - function callbackEntering(level, currentNode)
     * called when entering current node
     */
     function traverseRootToLeafs_EnterLeave(tree, callbackEnter, callbackLeave) {
        var currentNode = tree['root'];
        recurseNode(tree, currentNode, callbackEnter, callbackLeave, 0);
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
                var msg = 'parentKey undefined or null';
                return {
                    result: msg,
                    node: undefined
                };
            }
        },
        insertOver: function (key, newContent) {
            return insertNodeOver(this, key, newContent);
        },
        remove: function (key) {
            var node = removeNode(this, key);
            if (node === undefined) {
                node = {
                    content: 'nothing'
                };
            }
            return node;
        },

        /**
         * 
         * @param {function(level, currentNode)} callback - function applied to current node while traversing the tree
         */
        fromRootToLeafs: function (callback) {
            traverseRootToLeafs(this, callback);
        },
        fromRootToLeafs_EnterLeave: function (callbackEnter, callbackLeave) {
            traverseRootToLeafs_EnterLeave(this, callbackEnter, callbackLeave);
        },
        /**
         * 
         * @param {function(level, currentNode)} callback - function applied to current node while traversing the tree
         */
        fromLeafsToRoot: function (callback) {
            traverseLeafsToRoot(this, callback);
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
            // isLeaf: function () {
            //     return (this.children.length === 0);
            // }
        };
        newTree['root'] = rootNode;
        return newTree;
    }

    function createTreeFromJson(jsonTree) {
        // enhance jsonTree with methods of tree
        // https://medium.com/swlh/ellipses-three-dots-or-three-periods-in-javascript-a-primer-to-the-spread-operator-4993984591f5
        return {
            ...jsonTree,
            ...tree
        };
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
                // isLeaf: function () {
                //     return (this.children.length === 0);
                // }
            };
            tree[newKey] = newNode;
            parent.children = [...(parent.children || []), newNode.key];
            return {
                result: 'OK',
                node: newNode
            };
        } else {
            var msg = 'unknown parent key: ' + parentKey;
            return {
                result: msg,
                node: undefined
            };
        }
    }

    /**
     * 
     * @param {*} tree - tree to which node will be added
     * @param {*} key - key of node where newNode will be inserted over
     * @param {*} newContent - content of the new node
     * @returns the new node
     */
    function insertNodeOver(tree, key, newContent) {
        var node = tree[key];
        if (!node) {
            var msg = "node with key " + key + "doesn't exist";
            return {
                result: msg,
                node: undefined
            };
        }
        var parent = tree[node.parentKey];
        if (parent) {
            var newKey = nonexistingRandomKey(tree, 3);
            var newNode = {
                key: newKey,
                parentKey: node.parentKey,
                children: [node.key],
                content: newContent,
                // isLeaf: function () {
                //     return (this.children.length === 0);
                // }
            };
            var childIndex = parent.children.indexOf(node.key);
            parent.children[childIndex] = newKey;
            tree[newKey] = newNode;
            return {
                result: 'OK',
                node: newNode
            };
        } else {
            msg = 'unknown parent key: ' + node.parentKey;
            return {
                result: msg,
                node: undefined
            };
        }
    }

    function removeNode(tree, key) {
        var node = tree[key];
        if (node) {
            console.log(node.key, 'has children', node.children);
            // TODO necessary? if(node.children && node.children.length > 0){}
            var parent, childIndex, node_clone, msg;
            switch (node.children.length) {
                case 0:
                    // no children
                    parent = tree[node.parentKey];
                    if (parent) {
                        childIndex = parent.children.indexOf(key);
                        // remove key from array of children of parent
                        parent.children.splice(childIndex);
                        node_clone = JSON.parse(JSON.stringify(node));
                        delete tree[key];
                        return {
                            result: 'OK',
                            node: node_clone
                        };
                    } else {
                        msg = 'root cannot be removed';
                        return {
                            result: msg,
                            node: undefined
                        };
                    }
                    // return {
                    //     result: 'OK', node: node
                    // };
                    case 1:
                        // exactly one child
                        parent = tree[node.parentKey];
                        if (parent) {
                            childIndex = parent.children.indexOf(key);
                            var grandchildKey = node.children[0];
                            var grandchild = tree[grandchildKey];
                            // replace key of child with key of grandchild in array of children of parent
                            parent.children[childIndex] = grandchildKey;
                            // replace parentKey of grandchild with parentKey of node
                            grandchild.parentKey = node.parentKey;
                            node_clone = JSON.parse(JSON.stringify(node));
                            delete tree[key];
                            return {
                                result: 'OK',
                                node: node_clone
                            };
                        } else {
                            msg = 'root cannot be removed';
                            return {
                                result: msg,
                                node: undefined
                            };
                        }
                        // return node; //no break necessary
                        default:
                            // more than one child
                            msg = 'node with more than one child cannot be removed';
                            return {
                                result: msg,
                                    node: undefined
                            };
            }
            // console.log(tree);

        } else {
            msg = 'node with key' + key + ' does not exist';
            return {
                result: msg,
                node: undefined
            };
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
                console.warn('try number', i, 'not successful:', candidate, 'exists');
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
        var w = tree.addNode("root", "content-W").node;
        var y = tree.addNode("root", "content-Y").node;
        tree.addNode(w.key, "content-R").node;
        // var a1 = tree.addNode(w.key, "content-A").node; //for demo: double content is allowed
        var s = tree.addNode(w.key, "content-S").node;
        tree.addNode(w.key, "content-E").node;
        var t = tree.addNode(s.key, "content-T").node;
        tree.addNode(y.key, "content-A").node;
        var c = tree.addNode(y.key, "content-C").node;
        // removing nodes -testcase
        // var response;
        // response=tree.remove('dummy-key');
        // if (response.result === 'OK') {
        //     console.log('removed:', response.node.content);
        // } else {
        //     console.log('error:', response.result);
        // }
        // response=tree.remove(s.key);
        // if (response.result === 'OK') {
        //     console.log('removed:', response.node.content);
        // } else {
        //     console.log('error:', response.result);
        // }
        // response=tree.remove(e.key);
        // if (response.result === 'OK') {
        //     console.log('removed:', response.node.content);
        // } else {
        //     console.log('error:', response.result);
        // }
        // response=tree.remove('root');
        // if (response.result === 'OK') {
        //     console.log('removed:', response.node.content);
        // } else {
        //     console.log('error:', response.result);
        // }
        // response=tree.remove(y.key);
        // if (response.result === 'OK') {
        //     console.log('removed:', response.node.content);
        // } else {
        //     console.log('error:', response.result);
        // }
        // insertOver - testcase
        var k = tree.insertOver(c.key, 'Insert-K').node;
        console.log('inserted:', k);
        var b = tree.insertOver(t.key, 'Insert-B').node;
        console.log('inserted:', b);
        return tree;
    }

    var version = "0.1.15";

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
    exports.createTreeFromJson = createTreeFromJson;
    exports.demoTree = demoTree;
    exports.mainIsLoaded = mainIsLoaded;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
