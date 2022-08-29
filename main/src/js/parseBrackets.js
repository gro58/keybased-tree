// import waitforClickModule from './waitForClick.js';

/**
 * 
 * @param {*} haystack - LaTeX string with brackets to be looked for
 * @returns {object} - bestPosition: position of leftmost bracket or -1 if no bracket found
 * - bracket: kind of bracket corresponding to best position or null if no bracket found

 */
function findLeftmostBracket(haystack) {
    var found = '';
    var bestPos = -1;
    /**
     * changes parameters found and bestPos
     *
     * @param {*} needle - bracket to be looked for
     * changes variables bestPos and found
     * @returns {object} bestPos - position of leftmost bracket or -1 if no bracket
     * found - type of bracket at bestPos or empty string if no bracket
     */
    function lookForBracket(needle) {
        var newPos = haystack.indexOf(needle);
        var improvement = improvePosition(newPos);
        // remember kind of bracket corresponding to best position
        if (improvement) {
            found = needle;
            // console.log('improvement: found ' + needle + ' at position ' + bestPos);
        }
    }

    function improvePosition(newPos) {
        if (newPos !== -1) {
            if (bestPos === -1) {
                // any nonnegative position is better than -1
                bestPos = newPos;
                return true;
            } else {
                if (newPos < bestPos) {
                    // smaller is better
                    bestPos = newPos;
                    return true;
                }
            }
        } //else 
        // newPos === -1 means no improvement, do not change bestPos
        return false;
        //default: no improvement
    }

    // console.log(Array(20 + 1).join("-"));
    console.log(haystack);
    //look for different types of brackets
    //and improve position if better (smaller but not -1)
    lookForBracket('\\left(');
    lookForBracket('\\left[');
    lookForBracket('\\left\\{');
    lookForBracket('(');
    lookForBracket('[');
    lookForBracket('{');

    return {
        leftPos: bestPos,
        leftBracket: found
    };
}


/** 
 * 
 * @param {string} haystack 
 * @returns {object} message, leftBracket, leftpos, rightBracket, rightpos
 * message = 'OK' or error message
 * leftpos = position of first accurence of left bracket
 * rightpos = position of corresponding(!) right bracket     
 */
export function findLeftmostBracketPair(haystack) {
    var leftResult = findLeftmostBracket(haystack);

    var message = 'OK';
    var leftPos = -1;
    var rightPos = -1;

    const left2right = {
        '(': ')',
        '[': ']',
        '{': '}',
        '|': '|',
        '\\left(': '\\right)',
        '\\left[': '\\right]',
        '\\left\\{': '\\right\\}',
        '\\left|': '\\right|'
    }
    var rightBracket = left2right[leftResult.leftBracket];
    if (typeof rightBracket === 'undefined') {
        rightBracket = '';
        message = 'no left bracket';
    } else {
        var pos;
        var stop = false;
        var weight = [];
        for (var i = 0; i < haystack.length; i++) {
            weight[i] = 0;
        }
        pos = -1;
        do {
            pos = haystack.indexOf(leftResult.leftBracket, pos + 1);
            if (pos === -1) {
                stop = true;
            } else {
                // left bracket has weight 1
                weight[pos] = 1;
                if (leftPos === -1) {
                    leftPos = pos;
                }
            }
        } while (stop === false);
        if (leftPos === -1) {
            message = 'no left bracket found: ' + leftResult.leftBracket;
        } else {
            pos = -1;
            stop = false;
            do {
                pos = haystack.indexOf(rightBracket, pos + 1);
                if (pos === -1) {
                    stop = true;
                } else {
                    // right bracket has weight -1
                    weight[pos] = -1;
                }
            } while (stop === false);
            // calculate sum of masses (and store in weight array)
            for (i = 1; i < haystack.length; i++) {
                var sum = weight[i - 1] + weight[i];
                if (weight[i] === -1 && sum === 0) {
                    rightPos = i;
                    // short circuit; stop calculating sums
                    break;
                }
                weight[i] = sum;
            }
            if (rightPos === -1) {
                message = 'no corresponding right bracket found: ' + rightBracket;
            }
        }
    }
    if (leftPos !== leftResult.leftPos) {
        throw new Error('inconsistent left positions of brackets. This should not happen');
    }
    return {
        message: message,
        leftBracket: leftResult.leftBracket,
        leftPos: leftPos,
        rightBracket: rightBracket,
        rightPos: rightPos,
    }
}

/**
 * 
 * @param {*} tree - keybased tree object
 * @param {*} node - node of tree containing bracket(s)
 * @param {*} mode - if mode==='single, decompose single leftmost bracket
 * else decompose all brackets of node but no inner brackets
 * @returns 
 */
export function decomposeNodeBrackets(tree, node, mode) {
    if (mode === 'single') {
        result = decomposeSingleNodeBracket(tree, node);
        console.log(node.content, mode, result);
        return result;
    } else {
        do {
            var result = decomposeSingleNodeBracket(tree, node);
        } while (result === 'OK');
        return result;
    }
}

function decomposeSingleNodeBracket(tree, node) {
    var content = node.content;
    var result = findLeftmostBracketPair(content);
    console.log(result.message, result.leftBracket, result.leftPos);
    if (result.message === 'OK') {
        var leftpart = content.substring(0, result.leftPos);
        var middlepart = content.substring(result.leftPos + result.leftBracket.length, result.rightPos);
        var rightpart = content.substring(result.rightPos + result.rightBracket.length);
        node.content = leftpart + '§' + rightpart;
        var bracketNode = tree.addNode(node.key, 'bracket-' + result.leftBracket);
        var added = tree.addNode(bracketNode.key, middlepart);
        console.log(added);
    } else {
        // node.content = result.message;
    }
    return result.message;
}