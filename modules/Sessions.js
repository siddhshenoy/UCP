
var Sessions = {
    ValidSession : function(req)
    {
        return (req.session !== undefined);
    },
    GetSessionKey : function(req, key) {
        if(this.ValidSession(req)) {
            return req.session[key];
        }
        return null;
    }
}
exports.Sessions = Sessions;