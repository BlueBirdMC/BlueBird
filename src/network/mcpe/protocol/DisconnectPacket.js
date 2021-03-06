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

class DisconnectPacket extends DataPacket {
	static NETWORK_ID = Identifiers.DISCONNECT_PACKET;

	hideDisconnectionScreen = false;
	message = "";

	canBeSentBeforeLogin = true;

	decodePayload() {
		this.hideDisconnectionScreen = this.readBool();
		if (!this.hideDisconnectionScreen) {
			this.message = this.readString();
		}
	}

	encodePayload() {
		this.writeBool(this.hideDisconnectionScreen);
		if (!this.hideDisconnectionScreen) {
			this.writeString(this.message);
		}
	}
}

module.exports = DisconnectPacket;
