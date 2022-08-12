"use strict";
// 

import config from "./js/config.json";
import {createTree} from './js/keybasedTree.js';
import {demoTree} from './js/CreateDemoTree.js';
import {version} from '../package.json';

// after import of bundle, using <script src='build/bundle.js'></script>,
// the bridge object with the following exports is available, e.g. using <script> in HTML
export {
    config,
    createTree,
    version,
    demoTree
};

window.onload = function () {
    console.log('version (from package.json) ', version);
    // var newTree = demoTree();
    // console.log(newTree);
};

export function mainIsLoaded() {
    return true;
}