const Observer = require('./Observer');

class Investor extends Observer {
	constructor(name) {
		super();
		this.name = name;
		this.notifications = [];
	}

	update(stock, data) {
		const message = `${this.name} nhận cập nhật: ${data.symbol} thay đổi từ ${data.oldPrice} thành ${data.newPrice}`;
		this.notifications.push(message);
		return message;
	}
}

module.exports = Investor;
