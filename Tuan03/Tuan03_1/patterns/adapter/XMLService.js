class XMLService {
	send(xmlData) {
		return {
			format: 'XML',
			payload: xmlData,
			status: 'accepted'
		};
	}
}

module.exports = XMLService;
