import {
    traverseRootToLeafs,
    traverseLeafsToRoot
} from './traverseTree.js';

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
    insertOver: function(key, newContent){
        return insertNodeOver(this, key, newContent);
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
    remove: function (key) {
        var node = removeNode(this, key);
        if (node === undefined) {
            node = {
                content: 'nothing'
            };
        }
        return node;
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
        // isLeaf: function () {
        //     return (this.children.length === 0);
        // }
    }
    newTree['root'] = rootNode;
    return newTree;
}

export function createTreeFromJson(jsonTree) {
    // enhance jsonTree with methods of tree
    return {...jsonTree, ...tree};
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
        parent.children = [...(parent.children || []), newNode.key]
        return newNode;
    } else {
        console.warn('unknown parent key: ', parentKey);
        return undefined;
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
        throw "node with key " + key + "doesn't exist";
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
        return newNode;
    } else {
        console.warn('unknown parent key: ', node.parentKey);
        return undefined;
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
                    console.warn('root cannot be removed');
                }
                return node; //no break necessary
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
                    return node_clone; //no break necessary
                } else {
                    console.warn('root cannot be removed');
                }
                return node; //no break necessary
            default:
                // more than one child
                console.warn('node with more than one child cannot be removed');
        }
        // console.log(tree);

    } else {
        console.warn('node with key', key, 'does not exist');
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
            console.warn('try number', i, 'not successful:', candidate, 'exists');
        }
    }
    if (newKey === null) {
        throw 'no new key found';
    }
    return newKey;
}