const FileSystemItem = require('./FileSystemItem');

class Folder extends FileSystemItem {
    constructor(name) {
        super(name);
        this.children = [];
    }

    add(item) {
        this.children.push(item);
    }

    display() {
        let result = `Folder: ${this.name}\n`;
        this.children.forEach(child => {
            result += "  " + child.display() + "\n";
        });
        return result;
    }
}

module.exports = Folder;