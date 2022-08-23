
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
     * @param {*} tree - tree to be traversed
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
     * direction root to leafs ist used by displaying the tree in common manner
     */
     function traverseRootToLeafs(tree, callback) {
        var emptyFunc = function () {};
        var currentNode = tree['root'];
        recurseNode(tree, currentNode, callback, emptyFunc, 0);
    }

    /**
     * 
     * @param {*} tree  -  keybased tree object
     * @param {*} callbackEnter   - function callbackEnter(level, currentNode)
     * called when entering current node
     * @param {*} callbackLeave  - function callbackLeave(level, currentNode)
     * called when leaving current node
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
     * direction "leafs to root" is used by evaluating an arithmetic tree
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
                return 'parentKey undefined or null';
            }
        },
        insertOver: function (key, newContent) {
            return insertNodeOver(this, key, newContent);
        },
        remove: function (key) {
            return removeNode(this, key);
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
        },
        /**
         * 
         * @param {function(level, currentNode)} callback - function applied to current node while traversing the tree
         */
        withAllLeafs: function (callback){
            traverseRootToLeafs(this, function(level, currentNode){
                if(currentNode.children.length === 0){
                    callback(level, currentNode);
                }
            });
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
            return newNode;
        } else {
            return 'unknown parent key: ' + parentKey;
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
            return 'node with key "' + key + '" does not exist';
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
            // TODO bug? better ad to childlist?
            parent.children[childIndex] = newKey;
            tree[newKey] = newNode;
            return newNode;
        } else {
            return 'unknown parent key: ' + node.parentKey;
        }
    }

    function removeNode(tree, key) {
        var node = tree[key];
        if (node) {
            console.log(node.key, 'has children', node.children);
            // TODO necessary? if(node.children && node.children.length > 0){}
            var parent, childIndex, node_clone;
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
                        return node_clone;
                    } else {
                        return 'root cannot be removed';
                    }
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
                            return node_clone;
                        } else {
                            return 'root cannot be removed';
                        }
                        default:
                            // more than one child
                            return 'node with more than one child cannot be removed';
            }
            // console.log(tree);

        } else {
            return 'node with key "' + key + '" does not exist';
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
        var w = tree.addNode("root", "content-W");
        var y = tree.addNode("root", "content-Y");
        tree.addNode(w.key, "content-R");
        // var a1 = tree.addNode(w.key, "content-A"); //for demo: double content is allowed
        var s = tree.addNode(w.key, "content-S");
        tree.addNode(w.key, "content-E");
        var t = tree.addNode(s.key, "content-T");
        tree.addNode(y.key, "content-A");
        var c = tree.addNode(y.key, "content-C");
        // removing nodes -testcase
        // var removedNodeOrErrorMessage;
        // removedNodeOrErrorMessage=tree.remove('dummy-key');
        // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
        //     console.log('removed:', removedNodeOrErrorMessage.content);
        // } else {
        //     console.log('error:', removedNodeOrErrorMessage);
        // }
        // removedNodeOrErrorMessage=tree.remove(s.key);
        // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
        //     console.log('removed:', removedNodeOrErrorMessage.content);
        // } else {
        //     console.log('error:', removedNodeOrErrorMessage);
        // }
        // removedNodeOrErrorMessage=tree.remove(e.key);
        // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
        //     console.log('removed:', removedNodeOrErrorMessage.content);
        // } else {
        //     console.log('error:', removedNodeOrErrorMessage);
        // }
        // removedNodeOrErrorMessage=tree.remove('root');
        // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
        //     console.log('removed:', removedNodeOrErrorMessage.content);
        // } else {
        //     console.log('error:', removedNodeOrErrorMessage);
        // }
        // removedNodeOrErrorMessage=tree.remove(y.key);
        // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
        //     console.log('removed:', removedNodeOrErrorMessage.content);
        // } else {
        //     console.log('error:', removedNodeOrErrorMessage);
        // }
        // insertOver - testcase
        var k = tree.insertOver(c.key, 'Insert-K');
        console.log('inserted:', k);
        var b = tree.insertOver(t.key, 'Insert-B');
        console.log('inserted:', b);
        return tree;
    }

    var version = "0.1.25";

    /**
     * create an array of LaTeX strings with brackets for test purposes
     */
    function createTexStrings(){
        var test = [];
        test.push('\\int _1^2\\frac{1}{x^2}\\ dx={{result}}');
        test.push('3.14 + \\left[\\left(2a+4b\\right)\\right]');
        test.push('x =\\left[\\left(2a+(4b+c)\\right)\\left(7d-9e\\left(\\frac{z}{u+2(c+3)}\\right)\\right)\\right]');
        test.push('u+\\left[\\left(2a+\\left\\{4b+c)\\right\\}\\right)\\left[7d-9e\\left(\\frac{z}{u+2(c+3)}\\right)\\right]\\right]');
        test.push('u+\\left[2a+\\left(4b+c\\right)\\right][7d-9e\\left(\\frac{z-2}{\\left(u+2\\right)(c+3)}\\right)]');
        test.push('\\left(s+\\left(a+2\\right)(5f-3\\left(w-r\\right))\\left(f-3\\right)-\\left(-s+22\\right)\\right)');
        test.push('3.14+\\left(s+\\left(a+2\\right)[5f-3\\left(w-r\\right)]\\left(f-3\\right)-\\left(-s+22\\right)\\right)');
        // no brackets
        test.push('a+3*(x-5b)');
        test.push('4+5*(w+t)[3-[z+u]]');
        test.push('4+5*[w+t]((3+z)+u)(r-v)');
        return test;
    }

    /**
     * 
     * @param {*} haystack - LaTeX string with brackets to be looked for
     * @returns {object} - bestPosition: position of leftmost bracket or -1 if no bracket found
     * - bracket: kind of bracket corresponding to best position or null if no bracket found

     */
    function findLeftmostBracket(haystack) {
        var found = null;
        var bestPos = -1;
        /**
         * changes parameters found and bestPos
         *
         * @param {*} needle - bracket to be looked for
         * changes variables bestPos and found
         * @returns {object} bestPos - position of leftmost bracket or -1 if no bracket
         * found - type of bracket at bestPos or null if no bracket
         */
        function lookForBracket(needle) {
            var newPos = haystack.indexOf(needle);
            var improvement = improvePosition(newPos);
            // remember kind of bracket corresponding to best position
            if (improvement) {
                found = needle;
                console.log('improvement: found ' + needle + ' at position ' + bestPos);
            }
        }

        console.log(Array(20+ 1).join("-"));
        console.log(haystack);
        //look for different types of brackets
        //and improve position if better (smaller but not -1)
        lookForBracket('\\left(');
        lookForBracket('\\left[');
        lookForBracket('\\left\\{');
        lookForBracket('(');
        lookForBracket('[');
        lookForBracket('{');

        return {
            bestPosition: bestPos,
            bracket: found
        };

        function improvePosition(newPos) {
            if (newPos !== -1) {
                if (bestPos === -1) {
                    // any nonnegative position is better than -1
                    bestPos = newPos;
                    return true;
                } else {
                    if (newPos < bestPos) {
                        // smaller is better
                        bestPos = newPos;
                        return true;
                    }
                }
            } //else 
            // newPos === -1 means no improvement, do not change bestPos
            return false;
            //default: no improvement
        }
    }

    window.onload = function () {
        console.log('version (from package.json) ', version);
        // var newTree = demoTree();
        // console.log(newTree);
    };

    function mainIsLoaded() {
        return true;
    }

    exports.config = config;
    exports.createTexStrings = createTexStrings;
    exports.createTree = createTree;
    exports.createTreeFromJson = createTreeFromJson;
    exports.demoTree = demoTree;
    exports.findLeftmostBracket = findLeftmostBracket;
    exports.mainIsLoaded = mainIsLoaded;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
