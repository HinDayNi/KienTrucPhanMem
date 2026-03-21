const Observer = require('./Observer');

class Investor extends Observer {
    constructor(name) {
        super();
        this.name = name;
    }

    update(price) {
        console.log(`${this.name} notified: New price = ${price}`);
    }
}

module.exports = Investor;