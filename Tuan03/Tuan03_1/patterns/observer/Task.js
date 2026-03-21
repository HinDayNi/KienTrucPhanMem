const Subject = require('./Subject');

class Task extends Subject {
  constructor(title, status) {
    super();
    this.title = title;
    this.status = status;
  }

  setStatus(newStatus) {
    if (newStatus === this.status) {
      return;
    }

    const oldStatus = this.status;
    this.status = newStatus;
    this.notify({
      title: this.title,
      oldStatus,
      newStatus
    });
  }
}

module.exports = Task;