/**
 * 
 * @param {*} haystack - LaTeX string with brackets to be looked for
 * @returns {object} - bestPosition: position of leftmost bracket or -1 if no bracket found
 * - bracket: kind of bracket corresponding to best position or null if no bracket found

 */
export default function findLeftmostBracket(haystack) {
    var found = null;
    var bestPos = -1;
    /**
     * changes parameters found and bestPos
     *
     * @param {*} needle - bracket to be looked for
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

    //look for different types of brackets
    //and improve position if better (smaller but not -1)
    lookForBracket('\\left(');
    lookForBracket('\\left[');
    lookForBracket('\\left\\{');
    lookForBracket('(');
    lookForBracket('[');
    lookForBracket('{');

    return {
        bestPosition: bestPos,
        bracket: found
    };

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
}