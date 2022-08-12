"use strict";
// 

import config from "./js/config.json";
import {version} from '../package.json';


// bridge
export {
    config
};

window.onload = function () {
    console.log('version (from package.json) ', version);
};

export function mainIsLoaded() {
    return true;
}