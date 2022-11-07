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
    var a1 = tree.addNode(w.key, "content-R");
    // var a1 = tree.addNode(w.key, "content-A"); //for demo: double content is allowed
    var s = tree.addNode(w.key, "content-S");
    var e = tree.addNode(w.key, "content-E");
    var t = tree.addNode(s.key, "content-T");
    var a2 = tree.addNode(y.key, "content-A");
    var c = tree.addNode(y.key, "content-C");

    // removing nodes -testcase
    function removeNode(tree, key) {
        var removedNodeOrErrorMessage = tree.remove(key);
        if (typeof removedNodeOrErrorMessage.key !== 'undefined') {
            console.log('removed:', removedNodeOrErrorMessage.content);
        } else {
            console.log('error:', removedNodeOrErrorMessage);
        }
    }

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
