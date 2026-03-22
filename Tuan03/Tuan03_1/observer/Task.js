const Subject = require('./Subject');

class Task extends Subject {
    constructor(taskName) {
        super();
        this.taskName = taskName;
        this.status = 'TODO';
    }

    updateStatus(newStatus) {
        const oldStatus = this.status;
        this.status = newStatus;

        this.notify({
            taskName: this.taskName,
            oldStatus,
            newStatus
        });
    }
}

module.exports = Task;
