var express = require('express');
var mysql = require('mysql');
var crypto = require('crypto');
var sessions = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const ini = require('read-ini-file');
const path = require('path')
var genresp = require('./modules/Response');
var sess = require('./modules/Sessions');
var creds = require('./modules/Credentials');
const CONSTANTS = require('./modules/Constants');
const { application } = require('express');
/**
 * Initialization
 */

var app = express();
var mysql_conf_ini = (() => {
    const mysql_conf_file_path = path.join(__dirname, 'configuration/mysql_conf.ini');
    return ini.sync(mysql_conf_file_path);
})();

var cred_conf_ini = (() => {
    const mysql_conf_file_path = path.join(__dirname, 'configuration/creds_conf.ini');
    return ini.sync(mysql_conf_file_path);
})();

var MySQL = mysql.createConnection({
    host: mysql_conf_ini["CREDENTIALS"]["HOSTNAME"],
    user: mysql_conf_ini["CREDENTIALS"]["USERNAME"],
    password: mysql_conf_ini["CREDENTIALS"]["PASSWORD"],
    database: mysql_conf_ini["CREDENTIALS"]["DATABASE"]
});


//var MySQL = mysql.createConnection({
    //host
//})
/**
 * Middlewares
 */
 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use(express.static("./public"));

//Application CORS configuration
app.use(cors(
        {
            credentials: true,
            origin: 'http://localhost:3000'
        }
    )
);


const SESSION_ONE_DAY = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: 'a0a8f59b05cf70c044776e028e9844b3',
    saveUninitialized: true,
    cookie: { maxAge: SESSION_ONE_DAY},
    resave: false 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Requests
 */

app.post("/checklogin", (req, res) => {
    var Response = {};
    Response = genresp.Response.GenericResponse(-1,
        {
            "code" : "NOT_LOGGED_IN",
        }
    );
    console.log("Session: " + req.session.id);
    //if(sess.Sessions.ValidSession(req))
    if(req.session !== undefined)
    {
        let keyLoggedIn = sess.Sessions.GetSessionKey(req, "LoggedIn");
        console.log("keyLoggedIn: " + keyLoggedIn);
        console.log("LoggedIn: " + req.session.LoggedIn);
        console.log(req.session);
        console.log(req.sessionID);
        if(keyLoggedIn !== undefined && keyLoggedIn !== null)
        {
            if(keyLoggedIn)
            {
                Response = genresp.Response.GenericResponse(1,
                    {
                        "code" : "LOGGED_IN",
                    }
                );          
            }
            else req.session.LoggedIn = false;
        }
        else {
            req.session.LoggedIn = false;
        }
    }
    res.send(Response);
});
app.post("/userlogout", (req,res) => {
    var Response = {};
    Response = genresp.Response.GenericResponse(-1,
        {
            "code" : "LOGOUT_PROCESS_FAILURE"
        }
    );

    if(req.session !== undefined)
    {
        let LoggedIn = sess.Sessions.GetSessionKey(req, "LoggedIn");
        if(LoggedIn !== undefined && LoggedIn !== null)
        {
            
            Response = genresp.Response.GenericResponse(1,
                {
                    "code" : "LOGOUT_SUCCESS"
                }
            );
            console.log("[SESSION-DESTROY]: Session destroyed with session ID: %s", req.sessionID);
            req.session.destroy();
        }
    }
    res.send(Response);
})
app.post("/updatevehicle", (req, res) => {
    var Response = {};
    Response = genresp.Response.GenericResponse(-1,
        {
            "code" : "REQUEST_PROCESS_FAILURE"
        }
    );
    if(sess.Sessions.ValidSession(req))
    {
        let LoggedIn = sess.Sessions.GetSessionKey(req, "LoggedIn");
        if(LoggedIn !== undefined && LoggedIn !== null && LoggedIn !== false)
        {
            let Data = req.body["UpdateVehicleData"];
            let UserID = req.session.UserID;
            let ComponentString = Data.ComponentList.join(",");
            console.log("ComponentString: " + ComponentString);
            Data.ComponentString = ComponentString;
            console.log("Data:");
            console.log(Data);

            let szQuery = "UPDATE `personal_vehicles` SET `Components` = ?, Color0 = ? WHERE PVID = ? AND PID = ?";
            MySQL.query(
                szQuery,
                [Data.ComponentString, Data.Colors[0], Data.ID, UserID],
                function(err, result) {
                    if(err) throw err;
                    if(result.affectedRows > 0) {
                        Response = genresp.Response.GenericResponse(1,
                            {
                                "code" : "VEHICLE_UPDATE_SUCESS"
                            }
                        );
                    }
                    else {
                        Response = genresp.Response.GenericResponse(-11,
                        {
                            "code" : "VEHICLE_UPDATE_FAILURE"
                        }
                        );  
                    }
                    res.send(Response);
                }
            )
            

        }
        else res.send(Response);
    }
    else res.send(Response);
});
app.get("/fetchvehicles", (req, res) => {
    if(sess.Sessions.ValidSession(req))
    {
        let Response = genresp.Response.GenericResponse(-1, {
            "code" : "REQUEST_PROCESS_FAILURE"
        })
        let LoggedIn = sess.Sessions.GetSessionKey(req, "LoggedIn");
        console.log("LoggedIn: " + LoggedIn);
        if(LoggedIn !== undefined || LoggedIn !== null || LoggedIn !== false) {
            let PID = req.session.UserID;
            console.log("PlayerID: %d", PID);
            let szQuery = "SELECT * FROM `personal_vehicles` WHERE `PID` = ?";
            MySQL.query(szQuery,
                [PID],
                function(err, rows, cols) {
                    if(err) throw err;

                    let VehicleData = [];
                    let rowLen = rows.length;
                    if(rowLen > 0)
                    {
                        for(var i = 0; i < rowLen; i++)
                        {
                            let tempCompList = rows[i]["Components"];
                            let CompList = tempCompList.split(",");
                            for(var k = 0; k < CompList.length; k++)
                                CompList[k] = parseInt(CompList[k]);
                            let ArrayData = {
                                ID : rows[i]["PVID"],
                                Model : rows[i]["Model"],
                                VehicleName : CONSTANTS.ServerConstants.VehicleNames[parseInt(rows[i]["Model"]) - 400],
                                VehicleModelName : CONSTANTS.ServerConstants.VehicleModelNames[parseInt(rows[i]["Model"]) - 400],
                                Colors : [
                                    rows[i]["Color0"],
                                    rows[i]["Color1"]
                                ],
                                PaintJob : rows[i]["PaintJob"],
                                ComponentList : CompList
                            }
                            console.log("VehicleData: ");
                            console.log(ArrayData);
                            VehicleData.push(ArrayData);
                        }
                        
                    }
                    Response = genresp.Response.GenericResponse(1,
                        {
                            "VehicleData" : VehicleData
                        }
                    );
                    res.send(Response);
                }
            );
        }
        else
        {
            Response = genresp.Response.GenericResponse(-1, {
                "code" : "NOT_LOGGED_IN"
            });
            res.send(Response);
        }
    }
});
app.post("/userlogin", (req,res) => {
    var Response = {};
    Response = genresp.Response.GenericResponse(-1,
        {
            "code" : "ALREADY_LOGGED_IN",
        }
    );
    if(sess.Sessions.ValidSession(req))
    {
        let LoggedIn = sess.Sessions.GetSessionKey(req, "LoggedIn");
        console.log("LoggedIn: " + LoggedIn);
        if(LoggedIn === undefined || LoggedIn === null || LoggedIn === false) {
            let Username = req.body["Username"];
            let Password = req.body["Password"];
            let HashPass = creds.Credentials.PassHash(Password,cred_conf_ini["PASSHASH"]["PassHash"]);
            console.log("Username Received: %s, Password Received: %s", Username, Password);
            console.log("Password Hash: %s", HashPass);
            let szQuery = "SELECT * FROM `players` WHERE `Playername` = ? AND `Password` = ?";
            MySQL.query(szQuery,
                [Username, HashPass],
                function(err, rows, cols){
                    Response = genresp.Response.GenericResponse(-1, {"code" : "ERR_FAILED_LOGIN_PROCESS"});
                    if(err) throw err;
                    let rowLen = rows.length;
                    if(rowLen > 0) {
                        req.session.LoggedIn = true;
                        req.session.UserID = rows[0]["PID"];
                        req.session.Username = rows[0]["Playername"];
                        req.session.UserCash = rows[0]["Money"];
                        req.session.save();
                        console.log("Created a session:");
                        //Remove this as this is only for debugging
                        console.log(req.session);
                        Response = genresp.Response.GenericResponse(1, {"code" : "LOGIN_SUCCESS"});
                        console.log("[SESSION-CREATE]: Session created with session ID: " + req.sessionID);
                    } else {
                        Response = genresp.Response.GenericResponse(-1, {"code" : "ERR_FAILED_LOGIN_INVALID_CREDS"});
                    }
                    res.send(Response);
                });
        } else {
            res.send(Response);
        }
    }
});
app.get("/", (req,res) => {
    res.send({});
});
/**
 * Application bootstrap
 */
var server = app.listen(8001, () => {
    var serverHost = server.address().address;
    var serverPort = server.address().port;
    console.log("[SERVER-BOOTSTRAP]: Express.js server started on %s:%s", serverHost, serverPort);
    //console.log(mysql_conf_ini["CREDENTIALS"]["HOST"]);
    MySQL.connect();
});