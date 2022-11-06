
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
                // parentKey: node.parentKey,
                parentKey: parent.key,
                children: [node.key],
                content: newContent,
                // isLeaf: function () {
                //     return (this.children.length === 0);
                // }
            };
            var childIndex = parent.children.indexOf(node.key);
            parent.children[childIndex] = newKey;
            node.parentKey = newKey;
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
                        // https://www.w3schools.com/jsref/jsref_splice.asp
                        parent.children.splice(childIndex, 1);
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

        // removeNode(tree, 'dummy-key');
        // removeNode(tree, s.key);
        // removeNode(tree, e.key);
        // removeNode(tree, 'root');
        // removeNode(tree, y.key);

        // insertOver - testcase
        var k = tree.insertOver(c.key, 'content-K');
        console.log('inserted:', k);
        var b = tree.insertOver(t.key, 'content-B');
        console.log('inserted:', b);
        return tree;
    }

    var version = "0.1.57";

    /**
     * create an array of LaTeX strings with brackets for test purposes
     */
    function createTexStrings(){
        var test = [];
        test.push('4+5*[w+t]((3+z)+u)(r-v)');
        test.push('\\int _1^2\\frac{1}{x^2}\\ dx={{result}}');
        test.push('3.14 + \\left[\\left(2a+4b\\right)\\right]');
        test.push('x =\\left[\\left(2a+(4b+c)\\right)\\left(7d-9e\\left(\\frac{z}{u+2(c+3)}\\right)\\right)\\right]');
        test.push('u+\\left[\\left(2a+\\left\\{4b+c)\\right\\}\\right)\\left[7d-9e\\left(\\frac{z}{u+2(c+3)}\\right)\\right]\\right]');
        test.push('v + \\left[2a+\\left(4b+c\\right)\\right][7d-9e\\left(\\frac{z-2}{\\left(u+2\\right)(c+3)}\\right)]');
        test.push('\\left(s+\\left(a+2\\right)(5f-3\\left(w-r\\right))\\left(f-3\\right)-\\left(-s+22\\right)\\right)');
        test.push('3.14+\\left(s+\\left(a+2\\right)[5f-3\\left(w-r\\right)]\\left(f-3\\right)-\\left(-s+22\\right)\\right)');
        test.push('a+3*(x-5b)');
        test.push('4+5*(w+t)[3-[z+u]]');
        test.push('a+3x-5b'); // no brackets
        test.push('\\left(a+3x-5b'); 
        test.push('\\left(a+3x-5b)'); 
        test.push('a+3x-5b\\right]'); 
        return test;
    }

    // import { waitforClickModule } from './waitForClick.js';

    /**
     * 
     * @param {*} haystack - LaTeX string with brackets to be looked for
     * @returns {object} - bestPosition: position of leftmost bracket or -1 if no bracket found
     * - bracket: kind of bracket corresponding to best position or null if no bracket found

     */
    function findLeftmostBracket(haystack) {
        var found = '';
        var bestPos = -1;
        /**
         * changes parameters found and bestPos
         *
         * @param {*} needle - bracket to be looked for
         * changes variables bestPos and found
         * @returns {object} bestPos - position of leftmost bracket or -1 if no bracket
         * found - type of bracket at bestPos or empty string if no bracket
         */
        function lookForBracket(needle) {
            var newPos = haystack.indexOf(needle);
            var improvement = improvePosition(newPos);
            // remember kind of bracket corresponding to best position
            if (improvement) {
                found = needle;
                // console.log('improvement: found ' + needle + ' at position ' + bestPos);
            }
        }

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

        // console.log(Array(20 + 1).join("-"));
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
            leftPos: bestPos,
            leftBracket: found
        };
    }


    /** 
     * 
     * @param {string} haystack 
     * @returns {object} message, leftBracket, leftpos, rightBracket, rightpos
     * message = 'OK' or error message
     * leftpos = position of first accurence of left bracket
     * rightpos = position of corresponding(!) right bracket     
     */
    function findLeftmostBracketPair(haystack) {
        var leftResult = findLeftmostBracket(haystack);

        var message = 'OK';
        var leftPos = -1;
        var rightPos = -1;

        const left2right = {
            '(': ')',
            '[': ']',
            '{': '}',
            '|': '|',
            '\\left(': '\\right)',
            '\\left[': '\\right]',
            '\\left\\{': '\\right\\}',
            '\\left|': '\\right|'
        };
        var rightBracket = left2right[leftResult.leftBracket];
        if (typeof rightBracket === 'undefined') {
            rightBracket = '';
            message = 'no left bracket';
        } else {
            var pos;
            var stop = false;
            var weight = [];
            for (var i = 0; i < haystack.length; i++) {
                weight[i] = 0;
            }
            pos = -1;
            do {
                pos = haystack.indexOf(leftResult.leftBracket, pos + 1);
                if (pos === -1) {
                    stop = true;
                } else {
                    // left bracket has weight 1
                    weight[pos] = 1;
                    if (leftPos === -1) {
                        leftPos = pos;
                    }
                }
            } while (stop === false);
            if (leftPos === -1) {
                message = 'no left bracket found: ' + leftResult.leftBracket;
            } else {
                pos = -1;
                stop = false;
                do {
                    pos = haystack.indexOf(rightBracket, pos + 1);
                    if (pos === -1) {
                        stop = true;
                    } else {
                        // right bracket has weight -1
                        weight[pos] = -1;
                    }
                } while (stop === false);
                // calculate sum of masses (and store in weight array)
                for (i = 1; i < haystack.length; i++) {
                    var sum = weight[i - 1] + weight[i];
                    if (weight[i] === -1 && sum === 0) {
                        rightPos = i;
                        // short circuit; stop calculating sums
                        break;
                    }
                    weight[i] = sum;
                }
                if (rightPos === -1) {
                    message = 'no corresponding right bracket found: ' + rightBracket;
                }
            }
        }
        if (leftPos !== leftResult.leftPos) {
            throw new Error('inconsistent left positions of brackets. This should not happen');
        }
        return {
            message: message,
            leftBracket: leftResult.leftBracket,
            leftPos: leftPos,
            rightBracket: rightBracket,
            rightPos: rightPos,
        }
    }

    /**
     * 
     * @param {*} tree - keybased tree object
     * @param {*} node - node of tree containing bracket(s)
     * @param {*} mode - if mode==='single, decompose single leftmost bracket
     * else decompose all brackets of node but no inner brackets
     * @returns 
     */
    async function decomposeNodeBrackets(tree, node, mode) {
        // console.log('decomposeNodeBrackets', node.content, mode);
        if (mode === 'single') {
            result = decomposeSingleNodeBracket(tree, node);
            return result;
        } else {
            do {
                var result = decomposeSingleNodeBracket(tree, node);
                // if (mode === 'tree') {
                //     console.log('waitForClick');
                //     await waitforClickModule.waitForClick();
                // }
            } while (result === 'OK');
            return result;
        }
    }

    function decomposeSingleNodeBracket(tree, node) {
        var content = node.content;
        var result = findLeftmostBracketPair(content);
        // console.log(result.message, result.leftBracket, result.leftPos);
        if (result.message === 'OK') {
            var leftpart = content.substring(0, result.leftPos);
            var middlepart = content.substring(result.leftPos + result.leftBracket.length, result.rightPos);
            var rightpart = content.substring(result.rightPos + result.rightBracket.length);
            node.content = leftpart + '§' + rightpart;
            var bracketNode = tree.addNode(node.key, 'bracket-' + result.leftBracket);
            var added = tree.addNode(bracketNode.key, middlepart);
            console.log(result.leftPos + result.leftBracket, added.content);
        }
        return result.message;
    }

    // https://stackoverflow.com/questions/51374649/using-async-functions-to-await-user-input-from-onclick
    var waitforClickModule = (function () {
        var clicked = false;
        var buttonElement, outputElement;

        const timeout = async ms => new Promise(res => setTimeout(res, ms));

        return {
            setButtonId: function (buttonElementId) {
                buttonElement = document.getElementById(buttonElementId);
                // eslint-disable-next-line no-unused-vars
                buttonElement.onclick = function clickEventHandler(ev) {
                    clicked = true;
                };
            },
            waitForClick: async function (ifClickedCallback) {
                // pauses script
                while (clicked === false) {
                    await timeout(50);
                    // console.log('waiting');
                }
                console.log('clicked');
                if (ifClickedCallback){
                    ifClickedCallback();
                }
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
    exports.decomposeNodeBrackets = decomposeNodeBrackets;
    exports.demoTree = demoTree;
    exports.findLeftmostBracketPair = findLeftmostBracketPair;
    exports.mainIsLoaded = mainIsLoaded;
    exports.version = version;
    exports.waitforClickModule = waitforClickModule;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=bundle.js.map
