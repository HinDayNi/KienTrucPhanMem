const Subject = require('./Subject');

class Stock extends Subject {
	constructor(symbol, initialPrice) {
		super();
		this.symbol = symbol;
		this.price = initialPrice;
	}

	setPrice(newPrice) {
		if (newPrice === this.price) {
			return;
		}

		const oldPrice = this.price;
		this.price = newPrice;
		this.notify({
			symbol: this.symbol,
			oldPrice,
			newPrice,
			change: newPrice - oldPrice
		});
	}
}

module.exports = Stock;
