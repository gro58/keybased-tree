/**
 * create an array of LaTeX strings with brackets for test purposes
 */
export default function createTexStrings(){
    var test = [];
    test.push('4+5*[w+t]((3+z)+u)(r-v)');
    test.push('\\int _1^2\\frac{1}{x^2}\\ dx={{result}}');
    test.push('3.14 + \\left[\\left(2a+4b\\right)\\right]');
    test.push('x =\\left[\\left(2a+(4b+c)\\right)\\left(7d-9e\\left(\\frac{z}{u+2(c+3)}\\right)\\right)\\right]');
    test.push('u+\\left[\\left(2a+\\left\\{4b+c)\\right\\}\\right)\\left[7d-9e\\left(\\frac{z}{u+2(c+3)}\\right)\\right]\\right]');
    test.push('u+\\left[2a+\\left(4b+c\\right)\\right][7d-9e\\left(\\frac{z-2}{\\left(u+2\\right)(c+3)}\\right)]');
    test.push('\\left(s+\\left(a+2\\right)(5f-3\\left(w-r\\right))\\left(f-3\\right)-\\left(-s+22\\right)\\right)');
    test.push('3.14+\\left(s+\\left(a+2\\right)[5f-3\\left(w-r\\right)]\\left(f-3\\right)-\\left(-s+22\\right)\\right)');
    test.push('a+3*(x-5b)');
    test.push('4+5*(w+t)[3-[z+u]]');
    test.push('a+3x-5b'); // no brackets
    test.push('\\left(a+3x-5b'); 
    test.push('\\left(a+3x-5b)'); 
    test.push('a+3x-5b\\right]'); 
    return test;
}