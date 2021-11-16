const file_sys = require('fs');

const config_dir = "./configuration/";
console.log("Checking for folder %s", config_dir);
if(!file_sys.existsSync(config_dir)) {
    console.log(" > Could not find %s, creating one now..", config_dir);
    file_sys.mkdirSync(config_dir);
    console.log(" > Done creating the folder \"%s\"", config_dir);
}
else {
    console.log(" > The folder \"%s\" already exists..", config_dir);
}

const mysql_file = config_dir + "mysql_conf.ini";
console.log("Checking for file %s", mysql_file);
if(!file_sys.existsSync(mysql_file)) {
    console.log(" > Could not find %s, creating one now..", mysql_file);
    let content = "[CREDENTIALS]\n\
#Database credentials go here\n\
HOSTNAME=<change-to-your-hostname>\n\
DATABASE=<change-to-your-database>\n\
USERNAME=<change-to-your-username>\n\
PASSWORD=<change-to-your-password>";
    file_sys.appendFileSync(mysql_file, content, function(err) {
        if(err) throw err;
    });
    console.log(" > Done creating the folder \"%s\"", mysql_file);
}
else {
    console.log(" > The file \"%s\" file exists..", mysql_file);
}


const creds_file = config_dir + "creds_conf.ini";
console.log("Checking for file %s", creds_file);
if(!file_sys.existsSync(creds_file)) {
    console.log(" > Could not find %s, creating one now..", creds_file);
    let content = "[PASSHASH]\n\
#Keep it blank if you donot wish to have any password salt or hash\n\
PassHash=";
    file_sys.appendFileSync(creds_file, content, function(err) {
        if(err) throw err;
    });
    console.log(" > Done creating the file \"%s\"", creds_file);
}
else {
    console.log(" > The file \"%s\" already exists..", creds_file);
}

