

var Response = {
    GenericResponse : function(Status, Payload) {
        return {
            "Status" : Status,
            "Payload" : Payload
        };
    }
}
exports.Response = Response;