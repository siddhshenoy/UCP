var crypto = require('crypto');

var Credentials = {
    
    PassHash : function(pass, salt="") {
        let hashPass = pass;
        if(salt !== undefined && salt !== null)
            hashPass = pass + salt;
        return crypto.createHash('sha256').update(hashPass).digest('hex').toUpperCase();
    }
}
exports.Credentials = Credentials;