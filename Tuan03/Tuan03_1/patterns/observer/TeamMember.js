const Observer = require('./Observer');

class TeamMember extends Observer {
  constructor(name) {
    super();
    this.name = name;
    this.notifications = [];
  }

  update(task, data) {
    const message = `${this.name} nhận cập nhật task: ${data.title} chuyển từ ${data.oldStatus} sang ${data.newStatus}`;
    this.notifications.push(message);
    return message;
  }
}

module.exports = TeamMember;