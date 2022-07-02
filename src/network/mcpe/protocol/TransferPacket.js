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

class TransferPacket extends DataPacket {
	static NETWORK_ID = Identifiers.TRANSFER_PACKET;

	/** @type {string} */
	address = "";

	/** @type {number} */
	port = 19132;

	decodePayload() {
		this.address = this.readString();
		this.port = this.readUnsignedShortLE();
	}

	encodePayload() {
		this.writeString(this.address);
		this.writeUnsignedShortLE(this.port);
	}
}

module.exports = TransferPacket;
