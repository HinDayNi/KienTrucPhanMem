const FileSystemItem = require('./FileSystemItem');

class File extends FileSystemItem {
    display() {
        return `File: ${this.name}`;
    }
}

module.exports = File;