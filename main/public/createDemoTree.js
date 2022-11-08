/* eslint-disable no-unused-vars */
import {
    createTree
} from './keybasedTree.js';

/**
 * create a tree for test purposes (e.g. traversing)
 * using addNode
 */
export function demoTree() {
    const tree = createTree('Demo Tree');
    const w = tree.addNode("root", "content-W");
    const y = tree.addNode("root", "content-Y");
    const a1 = tree.addNode(w.key, "content-R");
    // const a1 = tree.addNode(w.key, "content-A"); //for demo: double content is allowed
    const s = tree.addNode(w.key, "content-S");
    const e = tree.addNode(w.key, "content-E");
    const t = tree.addNode(s.key, "content-T");
    const a2 = tree.addNode(y.key, "content-A");
    const c = tree.addNode(y.key, "content-C");

    // removing nodes -testcase
    function removeNode(tree, key) {
        const removedNodeOrErrorMessage = tree.remove(key);
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
    const k = tree.insertOver(c.key, 'content-K');
    console.log('inserted:', k);
    const b = tree.insertOver(t.key, 'content-B');
    console.log('inserted:', b);
    return tree;
}
