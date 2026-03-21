const express = require('express');
const router = express.Router();

const File = require('../composite/File');
const Folder = require('../composite/Folder');

let root = new Folder("Root");

router.use(express.json());

router.post('/add', (req, res) => {
    const { name, type } = req.body;
    const cleanName = (name || '').trim();

    if (!cleanName) {
        return res.status(400).send('Tên item không được để trống.');
    }

    if (type !== 'file' && type !== 'folder') {
        return res.status(400).send('Loại item không hợp lệ.');
    }

    if (type === 'file') {
        root.add(new File(cleanName));
    } else {
        root.add(new Folder(cleanName));
    }

    return res.send("Added");
});

router.get('/tree', (req, res) => {
    res.send(root.display());
});

module.exports = router;