const Observer = require('./Observer');

class Investor extends Observer {
    constructor(name) {
        super();
        this.name = name;
    }

    update(event) {
        if (typeof event === 'number') {
            console.log(`${this.name} notified: New price = ${event}`);
            return;
        }

        const symbol = event.symbol || 'STOCK';
        console.log(
            `${this.name} notified: ${symbol} changed ${event.oldPrice} -> ${event.newPrice}`
        );
    }
}

module.exports = Investor;