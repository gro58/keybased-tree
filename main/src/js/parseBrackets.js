/**
 * 
 * @param {*} haystack - LaTeX string with brackets to be looked for
 * @returns {object} - bestPosition: position of leftmost bracket or -1 if no bracket found
 * - bracket: kind of bracket corresponding to best position or null if no bracket found

 */
export function findLeftmostBracket(haystack) {
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
            console.log('improvement: found ' + needle + ' at position ' + bestPos);
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

    console.log(Array(20 + 1).join("-"));
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
 * @param {string} leftbracket 
 * @returns {object} message, leftpos, leftbracketLength, rightpos, rightbracketLength
 * message = 'OK' or error message
 * leftpos = position of first accurence of left bracket
 * rightpos = position of corresponding(!) right bracket     
 */
export function findCorrespondingRightBracket(haystack, leftbracket) {
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
    var rightbracket = left2right[leftbracket];
    if (typeof rightbracket === 'undefined') {
        rightbracket = '';
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
            pos = haystack.indexOf(leftbracket, pos + 1);
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
            message = 'no left bracket found: ' + leftbracket;
        } else {
            pos = -1;
            stop = false;
            do {
                pos = haystack.indexOf(rightbracket, pos + 1);
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
                message = 'no corresponding right bracket found: ' + rightbracket;
            }
        }
    }
    return {
        message: message,
        leftPos: leftPos, //for comparison
        rightBracket: rightbracket,
        rightPos: rightPos,
    }
}