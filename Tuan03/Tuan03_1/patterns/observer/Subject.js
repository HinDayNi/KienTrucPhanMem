class Subject {
	constructor() {
		this.observers = new Set();
	}

	attach(observer) {
		this.observers.add(observer);
	}

	detach(observer) {
		this.observers.delete(observer);
	}

	notify(data) {
		for (const observer of this.observers) {
			observer.update(this, data);
		}
	}
}

module.exports = Subject;
