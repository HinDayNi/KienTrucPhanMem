const express = require('express');
const router = express.Router();

const xml2js = require('xml2js');

router.use(express.json());

router.post('/convert', async (req, res) => {
    const xml = (req.body.xml || '').trim();

    if (!xml) {
        return res.status(400).json({ message: 'XML không được để trống.' });
    }

    try {
        const parser = new xml2js.Parser();
        const json = await parser.parseStringPromise(xml);

        return res.json(json);
    } catch (error) {
        return res.status(400).json({ message: 'XML không hợp lệ.' });
    }
});

router.post('/convert/json-to-xml', (req, res) => {
    const raw = (req.body.json || '').trim();

    if (!raw) {
        return res.status(400).json({ message: 'JSON không được để trống.' });
    }

    try {
        const parsed = JSON.parse(raw);
        const builder = new xml2js.Builder({ headless: true });
        const xml = builder.buildObject(parsed);
        return res.json({ xml });
    } catch (error) {
        return res.status(400).json({ message: 'JSON không hợp lệ.' });
    }
});

module.exports = router;