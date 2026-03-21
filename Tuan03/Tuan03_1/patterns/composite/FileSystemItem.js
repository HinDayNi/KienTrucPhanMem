class FileSystemItem {
	constructor(name) {
		this.name = name;
	}

	display(indent) {
		throw new Error('display() phải được cài đặt ở lớp con.');
	}
}

module.exports = FileSystemItem;
