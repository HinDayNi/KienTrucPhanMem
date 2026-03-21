class JSONService {
    sendJSON(data) {
        return {
            message: "JSON processed successfully",
            data: data
        };
    }
}

module.exports = JSONService;