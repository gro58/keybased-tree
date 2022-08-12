function node(type, content){
    this.parentKey = null;
    this.children = [];
    this.isLeaf = (this.children.length > 0);
    this.content = content;
}

export var tree = {
    'root': new node('root', 'rootcontent')
}



console.log(tree);

