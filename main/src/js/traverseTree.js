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
 export function traverseRootToLeafs(tree, callback) {
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
 export function traverseRootToLeafs_EnterLeave(tree, callbackEnter, callbackLeave) {
    var currentNode = tree['root'];
    recurseNode(tree, currentNode, callbackEnter, callbackLeave, 0);
}

/**
 * 
 * @param {*} tree -  keybased tree object
 * @param {*} callback - function callbackLeaving(level, currentNode)
 * called when leaving current node
 */
 export function traverseLeafsToRoot(tree, callback) {
    var emptyFunc = function () {};
    // var emptyFunc = null; //causes TypeError
    var currentNode = tree['root'];
    recurseNode(tree, currentNode, emptyFunc, callback, 0);
}