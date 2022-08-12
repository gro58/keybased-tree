/* eslint-disable no-unused-vars */
import {
    createTree
} from './keybasedTree.js';

/**
 * create a tree for test purposes (e.g. traversing)
 * using addNode
 */
export function demoTree() {
    var tree = createTree('Demo Tree');
    var w = tree.addNode("root", "content-W");
    var y = tree.addNode("root", "content-Y");
    var a1 = tree.addNode(w.key, "content-A");
    var s = tree.addNode(w.key, "content-S");
    var e = tree.addNode(w.key, "content-E");
    var t = tree.addNode(s.key, "content-T");
    var a2 = tree.addNode(y.key, "content-A");
    var c = tree.addNode(y.key, "content-C");
    return tree;
}