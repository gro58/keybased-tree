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

export function createTree(rootcontent){
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
    var numOfChars = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * numOfChars));
    }
    return result;
}