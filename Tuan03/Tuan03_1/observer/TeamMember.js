const Observer = require('./Observer');

class TeamMember extends Observer {
    constructor(name) {
        super();
        this.name = name;
    }

    update(event) {
        console.log(
            `${this.name} notified: Task '${event.taskName}' changed ${event.oldStatus} -> ${event.newStatus}`
        );
    }
}

module.exports = TeamMember;
