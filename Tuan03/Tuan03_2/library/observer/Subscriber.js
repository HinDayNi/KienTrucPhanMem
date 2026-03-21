class Subscriber {
  constructor(name, role) {
    this.name = name;
    this.role = role || 'user';
  }

  update(event) {
    return `[${this.role}] ${this.name}: ${event}`;
  }
}

module.exports = Subscriber;
