import {
    traverseRootToLeafs
} from './traverseTree.js';

// variable tree has to be definde outside of createTree to have access to createNode
var tree = {
    addNode: function (parentKey, newContent) {
        if (parentKey) {
            return createNode(this, parentKey, newContent);
        } else {
            console.error('parentKey undefined or null');
            return null;
        }
    },
    /**
     * 
     * @param {function(level, currentNode)} callback - function applied to current node while traversing the tree
     */
    fromRootToLeaf: function (callback) {
        traverseRootToLeafs(this, callback);
    }
};

/**
 * creates a tree object with one node: the root node
 * @param {*} rootcontent - the content of the new root node
 * @returns tree object consisting of root node 
 */
export function createTree(rootcontent) {
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
    }
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
    // console.log('add node with content ' + newContent + ' to parent with key ' + parentKey);
    var parent = tree[parentKey];
    if (parent) {
        var newKey = sureRandomKey(tree, 3);
        var newNode = {
            key: newKey,
            content: newContent,
            parentKey: parentKey,
            isLeaf: function () {
                return (this.children.length === 0);
            }
        };
        tree[newKey] = newNode;
        parent.children = [...(parent.children || []), newNode.key]
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
    // var characters = 'abc'; //for test
    var numOfChars = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * numOfChars));
    }
    return result;
}

function sureRandomKey(tree, length) {
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
    if (newKey === null){
        throw 'no new key found';
    }
    return newKey;
}