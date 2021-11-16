#User Control Panel - GTA SAMP

A small User Control Panel that enables the players to edit their in game data from website. Currently the UCP does not feature a lot, it only has a 3d vehicle editor which enables the players to see their in-game saved vehicle on the browser. 

The front end is completely written in React.js and Three.js the backend is written in Express.js (I plan on switching it to a python based backend but not any sooner).

#Backend Setup

The backend is completely written in one file `server.js`, if you want to tweak around the request and response functionality, that is the file you want to fiddle with. To run the backend you can simply type the following command in command prompt:

> node server.js

However, before running the backend you will have to initialize the server configuration files. You can do that by simply running the command:

> node server-init.js

This will create 2 basic configuration files and a configuration folder `configuration` in your root directory. The two files are:

###mysql_conf.ini
This file contains the basic mysql credentials which the backend will require for communicating with the database.

###creds_conf.ini

This file is an addon to the authentication layer as this file is responsible for maintaining the salt. Change it to the salt you have used in your PAWN script.

#Frontend Setup

There isn't much about the frontend to setup however, you might have to get all the packages mentioned in the `package.json` before running a dev server or a build.

That's it for the setup. Happy Coding!