import {
    traverseRootToLeafs,
    traverseLeafsToRoot,
    traverseRootToLeafs_EnterLeave
} from './traverseTree.js';

// variable tree has to be definde outside of createTree to have access to createNode
const tree = {
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
        })
    }
};

/**
 * creates a tree object with one node: the root node
 * @param {*} rootcontent - the content of the new root node
 * @returns tree object consisting of root node 
 */
export function createTree(rootcontent) {
    // newTree inherits methods of tree object 
    const newTree = Object.create(tree);
    const rootNode = {
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
    const parent = tree[parentKey];
    if (parent) {
        const newKey = nonexistingRandomKey(tree, 3);
        const newNode = {
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
    const node = tree[key];
    if (!node) {
        return 'node with key "' + key + '" does not exist';
    }
    const parent = tree[node.parentKey];
    if (parent) {
        const newKey = nonexistingRandomKey(tree, 3);
        const newNode = {
            key: newKey,
            // parentKey: node.parentKey,
            parentKey: parent.key,
            children: [node.key],
            content: newContent,
            // isLeaf: function () {
            //     return (this.children.length === 0);
            // }
        };
        const childIndex = parent.children.indexOf(node.key);
        parent.children[childIndex] = newKey;
        node.parentKey = newKey;
        tree[newKey] = newNode;
        return newNode;
    } else {
        return 'unknown parent key: ' + node.parentKey;
    }
}

function removeNode(tree, key) {
    const node = tree[key];
    if (node) {
        console.log(node.key, 'has children', node.children);
        // TODO necessary? if(node.children && node.children.length > 0){}
        let parent, childIndex, node_clone;
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
                        const grandchildKey = node.children[0];
                        const grandchild = tree[grandchildKey];
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
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    // const characters = 'abc'; //for test
    const numOfChars = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * numOfChars));
    }
    return result;
}

function nonexistingRandomKey(tree, length) {
    const numOfTries = 10;
    // const numOfTries = 5; // for test
    const existingKeys = Object.keys(tree);
    // console.log('existingKeys', existingKeys);
    let newKey = null;
    for (let i = 0; i < numOfTries; i++) {
        const candidate = randomKey(length);
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