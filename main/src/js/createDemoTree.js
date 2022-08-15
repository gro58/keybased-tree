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
    var w = tree.addNode("root", "content-W").node;
    var y = tree.addNode("root", "content-Y").node;
    var a1 = tree.addNode(w.key, "content-R").node;
    // var a1 = tree.addNode(w.key, "content-A").node; //for demo: double content is allowed
    var s = tree.addNode(w.key, "content-S").node;
    var e = tree.addNode(w.key, "content-E").node;
    var t = tree.addNode(s.key, "content-T").node;
    var a2 = tree.addNode(y.key, "content-A").node;
    var c = tree.addNode(y.key, "content-C").node;
    // removing nodes -testcase
    // var response;
    // response=tree.remove('dummy-key');
    // if (response.result === 'OK') {
    //     console.log('removed:', response.node.content);
    // } else {
    //     console.log('error:', response.result);
    // }
    // response=tree.remove(s.key);
    // if (response.result === 'OK') {
    //     console.log('removed:', response.node.content);
    // } else {
    //     console.log('error:', response.result);
    // }
    // response=tree.remove(e.key);
    // if (response.result === 'OK') {
    //     console.log('removed:', response.node.content);
    // } else {
    //     console.log('error:', response.result);
    // }
    // response=tree.remove('root');
    // if (response.result === 'OK') {
    //     console.log('removed:', response.node.content);
    // } else {
    //     console.log('error:', response.result);
    // }
    // response=tree.remove(y.key);
    // if (response.result === 'OK') {
    //     console.log('removed:', response.node.content);
    // } else {
    //     console.log('error:', response.result);
    // }
    // insertOver - testcase
    var k = tree.insertOver(c.key, 'Insert-K').node;
    console.log('inserted:', k);
    var b = tree.insertOver(t.key, 'Insert-B').node;
    console.log('inserted:', b);
    return tree;
}