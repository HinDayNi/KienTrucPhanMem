const FileSystemItem = require('./FileSystemItem');

class Folder extends FileSystemItem {
	constructor(name) {
		super(name);
		this.children = [];
	}

	add(item) {
		this.children.push(item);
	}

	remove(itemName) {
		this.children = this.children.filter((item) => item.name !== itemName);
	}

	display(indent = 0) {
		const spaces = ' '.repeat(indent);
		const lines = [`${spaces}+ Folder: ${this.name}`];

		for (const child of this.children) {
			lines.push(child.display(indent + 2));
		}

		return lines.join('\n');
	}
}

module.exports = Folder;
