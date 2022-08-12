import {
    createTree
} from './keybasedTree.js';

/**
 * create a tree for test purposes (e.g. traversing)
 * using addNode
 */
export function demoTree() {
    var tree = createTree('Demo Tree')
    var w = tree.addNode("root", "content-W");
    var y = tree.addNode("root", "content-Y");
    var r = tree.addNode(w.key, "content-R");
    var s = tree.addNode(w.key, "content-S");
    var e = tree.addNode(w.key, "content-E");
    var t = tree.addNode(s.key, "content-T");
    return tree;
}