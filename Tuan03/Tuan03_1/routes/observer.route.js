const express = require('express');
const router = express.Router();

const Stock = require('../observer/Stock');
const Investor = require('../observer/Investor');
const Task = require('../observer/Task');
const TeamMember = require('../observer/TeamMember');

router.use(express.json());

const stock = new Stock('GOCH');
const sprintTask = new Task('Implement Observer module');

let stockLogs = [];
let taskLogs = [];

class UIInvestor extends Investor {
    update(event) {
        stockLogs.push(
            `${this.name} nhận ${event.symbol}: ${event.oldPrice} -> ${event.newPrice}`
        );
    }
}

class UITeamMember extends TeamMember {
    update(event) {
        taskLogs.push(
            `${this.name} nhận task '${event.taskName}': ${event.oldStatus} -> ${event.newStatus}`
        );
    }
}

stock.subscribe(new UIInvestor("A"));
stock.subscribe(new UIInvestor("B"));
sprintTask.subscribe(new UITeamMember('An'));
sprintTask.subscribe(new UITeamMember('Binh'));

function handleStockUpdate(req, res) {
    const price = Number(req.body.price);

    if (!Number.isFinite(price) || price < 0) {
        return res.status(400).send('Giá không hợp lệ. Giá phải là số >= 0.');
    }

    stockLogs = [];
    stock.setPrice(price);

    return res.send(stockLogs.join("\n"));
}

router.post('/stock/update', handleStockUpdate);

// Backward compatibility for old frontend endpoint.
router.post('/update', (req, res) => {
    return handleStockUpdate(req, res);
});

router.post('/task/update', (req, res) => {
    const allowedStatuses = ['TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
    const status = String(req.body.status || '').trim().toUpperCase();

    if (!allowedStatuses.includes(status)) {
        return res
            .status(400)
            .send(`Trạng thái không hợp lệ. Chỉ chấp nhận: ${allowedStatuses.join(', ')}`);
    }

    taskLogs = [];
    sprintTask.updateStatus(status);

    return res.send(taskLogs.join("\n"));
});

module.exports = router;