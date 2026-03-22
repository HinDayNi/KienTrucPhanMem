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
const stockSubscribers = [];
const taskSubscribers = [];

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

function subscribeStockInvestor(name) {
    const investor = new UIInvestor(name);
    stockSubscribers.push(investor);
    stock.subscribe(investor);
}

function subscribeTaskMember(name) {
    const member = new UITeamMember(name);
    taskSubscribers.push(member);
    sprintTask.subscribe(member);
}

subscribeStockInvestor('A');
subscribeStockInvestor('B');
subscribeTaskMember('An');
subscribeTaskMember('Binh');

router.get('/stock/subscribers', (req, res) => {
    return res.json(stockSubscribers.map(item => item.name));
});

router.get('/task/subscribers', (req, res) => {
    return res.json(taskSubscribers.map(item => item.name));
});

router.post('/stock/subscribe', (req, res) => {
    const name = String(req.body.name || '').trim();
    if (!name) {
        return res.status(400).send('Tên investor không hợp lệ.');
    }

    subscribeStockInvestor(name);
    return res.json(stockSubscribers.map(item => item.name));
});

router.post('/task/subscribe', (req, res) => {
    const name = String(req.body.name || '').trim();
    if (!name) {
        return res.status(400).send('Tên thành viên không hợp lệ.');
    }

    subscribeTaskMember(name);
    return res.json(taskSubscribers.map(item => item.name));
});

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