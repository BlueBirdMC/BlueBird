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

class ModalFormRequestPacket extends DataPacket {
	static NETWORK_ID = Identifiers.MODAL_FORM_REQUEST_PACKET;

	id = -1;
	content = "{}";

	decodePayload() {
		this.id = this.readVarInt();
		this.content = this.readString();
	}

	encodePayload() {
		this.writeVarInt(this.id);
		this.writeString(this.content);
	}
}

class ModalFormResponsePacket extends DataPacket {
	static NETWORK_ID = Identifiers.MODAL_FORM_RESPONSE_PACKET;

	id;
	response;

	decodePayload() {
		this.id = this.readVarInt();
		this.response = this.readString();
	}

	encodePayload() {
		this.writeVarInt(this.id);
		this.writeString(this.response);
	}

	handle(handler) {
		return handler.handleModalFormResponse(this);
	}
}

module.exports = {ModalFormRequestPacket, ModalFormResponsePacket};