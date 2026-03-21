const Subject = require('./Subject');

class Stock extends Subject {
    setPrice(price) {
        this.price = price;
        this.notify(price);
    }
}

module.exports = Stock;