class JSONService {
	send(jsonData) {
		return {
			format: 'JSON',
			payload: jsonData,
			status: 'accepted'
		};
	}
}

module.exports = JSONService;
