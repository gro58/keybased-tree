import {
    traverseRootToLeafs
} from './traverseTree.js';
/**
 * default node structure
 * @param {string|*} content - the content of the new created node, maybe a string or an object
 * parent and children are represented by their keys or array of keys
 * use of keys is preferred to use of references to parent nodes or child nodes
 * use of keys avoids problems with e.g. circular dependencies if using JSON.stringify
 * separate key/content enables the same content for different nodes
 */


var node = {
    key: undefined,
    parentKey: null,
    children: [],
    content: undefined,
    isLeaf: function () {
        return (this.children.length === 0)
    }
}

// variable tree has to be outside of createTree to have access to createNode
var tree = {
    // 'root': new node('dummy rootcontent'), //overwritten in createTree
    addNode: function (parentKey, newContent) {
        return createNode(this, parentKey, newContent);
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
    var newTree = Object.create(tree); //inherits methods
    console.log(newTree);
    newTree.addNode(null, rootcontent);
    console.log(newTree);
    // newTree.root.content = rootcontent;
    // newTree.root.key = 'root';
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
    if (parentKey) {
        // console.log('add node with content ' + newContent + ' to parent with key ' + parentKey);
        var parent = tree[parentKey];
        if (parent) {
            var newKey = randomKey(6);
            // var newNode = {
            //     key: newKey,
            //     content: newContent,
            //     parentKey: parentKey
            // };
            var newNode = new Object(node);
            newNode.key = newKey;
            newNode.content = newContent;
            newNode.parentKey = parentKey;
            tree[newKey] = newNode;
            parent.children = [...(parent.children || []), newNode.key]
            return newNode;
        } else {
            // TODO throw error
            console.log('unknown parent key: ', parentKey);
            return null;
        }
    } else {
        //parentKey null or undefined: init tree
        newNode = new Object(node);
        newNode.key = 'root';
        newNode.content = newContent;
        newNode.parentKey = null;
        newNode.children = [];
        tree['root'] = newNode;
        return newNode;
        // var rootNode = {
        //     key: 'root',
        //     content: newContent,
        //     parentKey: null,
        //     children: []
        // };
        // tree['root'] = rootNode;
    }
}

function randomKey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    var numOfChars = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * numOfChars));
    }
    return result;
}