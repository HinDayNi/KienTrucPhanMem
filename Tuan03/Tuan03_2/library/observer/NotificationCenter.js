class NotificationCenter {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(name) {
    this.observers = this.observers.filter((observer) => observer.name !== name);
  }

  notify(event) {
    return this.observers.map((observer) => observer.update(event));
  }

  listObservers() {
    return this.observers.map((observer) => ({
      name: observer.name,
      role: observer.role
    }));
  }
}

module.exports = NotificationCenter;
