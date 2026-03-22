class Subject {
    constructor() {
        this.observers = [];
    }

    subscribe(obs) {
        if (!obs || typeof obs.update !== 'function') {
            throw new Error('Observer phải có hàm update(data).');
        }

        this.observers.push(obs);
    }

    unsubscribe(obs) {
        this.observers = this.observers.filter(item => item !== obs);
    }

    notify(data) {
        this.observers.forEach(obs => obs.update(data));
    }
}

module.exports = Subject;