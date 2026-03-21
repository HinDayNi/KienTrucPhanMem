class XMLtoJSONAdapter {
	constructor(xmlService, jsonService) {
		this.xmlService = xmlService;
		this.jsonService = jsonService;
	}

	sendXMLAsJSON(xmlString) {
		const jsonData = this.xmlToJson(xmlString);
		return this.jsonService.send(jsonData);
	}

	sendJSONAsXML(jsonData) {
		const xmlString = this.jsonToXml(jsonData);
		return this.xmlService.send(xmlString);
	}

	xmlToJson(xmlString) {
		const result = {};
		const tagRegex = /<([a-zA-Z0-9_]+)>([^<]*)<\/\1>/g;
		let match;

		while ((match = tagRegex.exec(xmlString)) !== null) {
			result[match[1]] = match[2];
		}

		return result;
	}

	jsonToXml(jsonData) {
		const tags = Object.entries(jsonData)
			.map(([key, value]) => `<${key}>${value}</${key}>`)
			.join('');

		return `<root>${tags}</root>`;
	}
}

module.exports = XMLtoJSONAdapter;
