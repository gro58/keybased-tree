import test from './createLatexTestStrings';

for (var i = 0; i <= test.length; i++){
    findLeftmostBracket(test[i]);
}

function findLeftmostBracket(texString){
    console.log(texString);
}