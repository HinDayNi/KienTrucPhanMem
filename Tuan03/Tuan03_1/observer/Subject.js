class Subject {
    constructor() {
        this.observers = [];
    }

    subscribe(obs) {
        this.observers.push(obs);
    }

    notify(data) {
        this.observers.forEach(obs => obs.update(data));
    }
}

module.exports = Subject;