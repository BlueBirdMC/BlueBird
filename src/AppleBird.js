* This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author AppleBirdMC Team /            *
\******************************************/

require("./ServerInfo");
const Path = require("path");
const Server = require("./Server");

class AppleBird {
	constructor() {
		let serverInstance = new Server(Path.normalize(__dirname + "/../"), NAME, VERSION);
		serverInstance.start();
	}
}

module.exports = AppleBird;
© 2022 GitHub, Inc.
Terms
Privacy
Security
Status
Doc
