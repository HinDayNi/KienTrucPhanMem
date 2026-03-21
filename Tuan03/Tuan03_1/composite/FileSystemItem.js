class FileSystemItem {
    constructor(name) {
        this.name = name;
    }

    display() {
        throw new Error("Method not implemented");
    }
}

module.exports = FileSystemItem;