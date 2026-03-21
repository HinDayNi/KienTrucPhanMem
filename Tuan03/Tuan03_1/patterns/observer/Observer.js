class Observer {
	update(subject, data) {
		throw new Error('update() must be implemented by subclasses.');
	}
}

module.exports = Observer;
