function node(content){
    this.parentKey = null;
    this.children = [];
    this.isLeaf = (this.children.length === 0);
    this.content = content;
}

export var tree = {
    'root': new node('rootcontent')
}

console.log(tree);

// tree.Prototype.addNode= function(parentKey){
//     console.log('add node to ', parentKey);
// }

