const Subject = require('./Subject');

class Stock extends Subject {
    constructor(symbol) {
        super();
        this.symbol = symbol;
        this.price = 0;
    }

    setPrice(price) {
        const oldPrice = this.price;
        this.price = price;
        this.notify({
            symbol: this.symbol,
            oldPrice,
            newPrice: price
        });
    }
}

module.exports = Stock;