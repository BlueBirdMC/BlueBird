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
const assert = require("assert");
const Zlib = require("zlib");
const PacketPool = require("./PacketPool");
const Identifiers = require("./Identifiers");
const NetworkBinaryStream = require("../../NetworkBinaryStream");

class GamePacket extends DataPacket {
	static NETWORK_ID = Identifiers.GAME_PACKET;

	/** @type {NetworkBinaryStream} */
	payload = new NetworkBinaryStream();

	/** @type {number} */
	compressionLevel = 7;

	/** @type {Boolean} */
	canBeBatched = false;

	/** @type {Boolean} */
	canBeSentBeforeLogin = true;

	decodeHeader() {
		let pid = this.readUnsignedByte();
		assert(pid === this.constructor.NETWORK_ID);
	}

	decodePayload() {
		let data = this.readRemaining();
		try {
			this.payload = new NetworkBinaryStream(Zlib.inflateRawSync(data, {
				level: this.compressionLevel,
				maxOutputLength: 1024 * 1024 * 2
			}));
		} catch (e) {
			//zlib decode error
			console.log(e);
			this.payload = new NetworkBinaryStream();
		}
	}

	encodeHeader() {
		this.writeUnsignedByte(this.constructor.NETWORK_ID);
	}

	encodePayload() {
		let buf = Zlib.deflateRawSync(this.payload.buffer, {level: this.compressionLevel});
		this.write(buf);
	}

	addPacket(packet) {
		if (!packet.canBeBatched) {
			throw new Error(`${packet.getName()} cant be batched`);
		}
		if (!packet.isEncoded) {
			packet.encode();
		}

		this.payload.writeVarInt(packet.buffer.length);
		this.payload.write(packet.buffer);
	}

	getPackets() {
		let packets = [];
		let count = 0;
		while (!this.payload.feos()) {
			if(count++ >= 500){
				throw new Error("Too many packets");
			}
			packets.push(this.payload.read(this.payload.readVarInt()));
		}
		return packets;
	}

	handle(handler) {
		if (this.payload.buffer.length === 0) {
			return false;
		}
		this.getPackets().forEach(buf => {
			let pk = PacketPool.getPacket(buf[0]);
			if (pk instanceof DataPacket) {
				if (!pk.canBeBatched) {
					throw new Error(`Received invalid ${pk.getName()} inside GamePacket`);
				}
				pk.buffer = buf;
				pk.offset = 1;
				handler.handleDataPacket(pk);
			} else {
				if(_DEBUG === true){
					console.log(`UNHANDLED PACKET: 0x${buf.slice(0, 1).toString("hex")}`);
					console.log(buf);
				}
			}
		});
		return true;
	}
}

module.exports = GamePacket;
