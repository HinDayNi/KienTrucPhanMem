const XMLService = require('./XMLService');
const JSONService = require('./JSONService');
const xml2js = require('xml2js');

class Adapter {
    async convert() {
        const xmlService = new XMLService();
        const jsonService = new JSONService();

        const xml = xmlService.getXML();

        const parser = new xml2js.Parser();
        const jsonData = await parser.parseStringPromise(xml);

        return jsonService.sendJSON(jsonData);
    }
}

module.exports = Adapter;