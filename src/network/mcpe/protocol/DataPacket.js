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

const NetworkBinaryStream = require("../../NetworkBinaryStream");

class DataPacket extends NetworkBinaryStream {
	static NETWORK_ID = 0;

	static PID_MASK = 0x3ff;

	static SUBCLIENT_ID_MASK = 0x03;
	static SENDER_SUBCLIENT_ID_SHIFT = 10;
	static RECIPIENT_SUBCLIENT_ID_SHIFT = 12;

	isEncoded = false;
	senderSubId = 0;
	recipientSubId = 0;
	canBeBatched = true;

	getName() {
		return this.constructor.name;
	}

	canBeSentBeforeLogin = false;

	mayHaveUnreadBytes = false;

	decode() {
		this.offset = 0;
		this.decodeHeader();
		this.decodePayload();
	}

	decodeHeader() {
		let header = this.readVarInt();
		let pid = header & this.constructor.PID_MASK;
		if (pid !== this.constructor.NETWORK_ID) {
			throw new Error(`Expected ${this.constructor.NETWORK_ID} for packet ID, got ${pid}`);
		}
		this.senderSubId = (header >> this.constructor.SENDER_SUBCLIENT_ID_SHIFT) & this.constructor.SUBCLIENT_ID_MASK;
		this.recipientSubId = (header >> this.constructor.RECIPIENT_SUBCLIENT_ID_SHIFT) & this.constructor.SUBCLIENT_ID_MASK;
	}

	decodePayload() {
	}

	encode() {
		this.reset();
		this.encodeHeader();
		this.encodePayload();
		this.isEncoded = true;
	}

	encodeHeader() {
		this.writeVarInt(this.constructor.NETWORK_ID |
			(this.senderSubId << this.constructor.SENDER_SUBCLIENT_ID_SHIFT) |
			(this.recipientSubId << this.constructor.RECIPIENT_SUBCLIENT_ID_SHIFT)
		);
	}

	encodePayload() {
	}

	clean() {
		this.isEncoded = false;
		super.reset();
	}

	/**
	 * @param {PlayerNetworkSession} handle
	 */
	handle(handle) {
		return false;
	}
}

module.exports = DataPacket;
