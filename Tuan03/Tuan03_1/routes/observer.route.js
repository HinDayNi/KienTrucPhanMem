const express = require('express');
const router = express.Router();

const Stock = require('../observer/Stock');
const Investor = require('../observer/Investor');

router.use(express.json());

const stock = new Stock();

let logs = [];

class UIInvestor extends Investor {
    update(price) {
        logs.push(`${this.name} nhận giá mới: ${price}`);
    }
}

stock.subscribe(new UIInvestor("A"));
stock.subscribe(new UIInvestor("B"));

router.post('/update', (req, res) => {
    const price = Number(req.body.price);

    if (!Number.isFinite(price) || price < 0) {
        return res.status(400).send('Giá không hợp lệ. Giá phải là số >= 0.');
    }

    logs = [];
    stock.setPrice(price);

    return res.send(logs.join("\n"));
});

module.exports = router;