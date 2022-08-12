"use strict";
// 

import config from "./js/config.json";
import {version} from '../package.json';
import {tree} from './js/keybasedTree.js';

// after import of bundle, using <script src='build/bundle.js'></script>,
// the bridge object with the following exports is available, e.g. using <script> in HTML
export {
    config,
    tree,
    version
};

window.onload = function () {
    console.log('version (from package.json) ', version);
};

export function mainIsLoaded() {
    return true;
}