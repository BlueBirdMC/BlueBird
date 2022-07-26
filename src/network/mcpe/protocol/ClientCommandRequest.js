/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const DataPacket = require("./DataPacket");
const Identifiers = require("./Identifiers");

class ClientCommandRequest extends DataPacket {
	static NETWORK_ID = Identifiers.CLIENT_COMMAND_REQUEST;

	/**
	 * @type {string}
	 */
	cmd;

	canBeSentBeforeLogin = true;

	decodePayload() {
		cmd = this.readString()
		// ik there are more things that server "needs" to read but i care only about the command, not the command type, and uuid
		console.log(cmd);
	}
}

module.exports = ClientCommandRequest;
