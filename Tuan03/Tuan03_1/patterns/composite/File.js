const FileSystemItem = require('./FileSystemItem');

class File extends FileSystemItem {
	constructor(name, size, data) {
		super(name);
		this.size = size || 0;
		this.data = data || '';
	}

	display(indent = 0) {
		const spaces = ' '.repeat(indent);
		return `${spaces}- File: ${this.name} (${this.size} KB)`;
	}
}

module.exports = File;
