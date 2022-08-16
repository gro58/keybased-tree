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
    // var removedNodeOrErrorMessage;
    // removedNodeOrErrorMessage=tree.remove('dummy-key');
    // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
    //     console.log('removed:', removedNodeOrErrorMessage.content);
    // } else {
    //     console.log('error:', removedNodeOrErrorMessage);
    // }
    // removedNodeOrErrorMessage=tree.remove(s.key);
    // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
    //     console.log('removed:', removedNodeOrErrorMessage.content);
    // } else {
    //     console.log('error:', removedNodeOrErrorMessage);
    // }
    // removedNodeOrErrorMessage=tree.remove(e.key);
    // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
    //     console.log('removed:', removedNodeOrErrorMessage.content);
    // } else {
    //     console.log('error:', removedNodeOrErrorMessage);
    // }
    // removedNodeOrErrorMessage=tree.remove('root');
    // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
    //     console.log('removed:', removedNodeOrErrorMessage.content);
    // } else {
    //     console.log('error:', removedNodeOrErrorMessage);
    // }
    // removedNodeOrErrorMessage=tree.remove(y.key);
    // if( typeof removedNodeOrErrorMessage.key !== 'undefined') {
    //     console.log('removed:', removedNodeOrErrorMessage.content);
    // } else {
    //     console.log('error:', removedNodeOrErrorMessage);
    // }
    // insertOver - testcase
    var k = tree.insertOver(c.key, 'Insert-K');
    console.log('inserted:', k);
    var b = tree.insertOver(t.key, 'Insert-B');
    console.log('inserted:', b);
    return tree;
}