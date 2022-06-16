// This file was created by PurpleBird team
// @author PurpleBirdMC
// @author andriycraft

const DataPacket = require("./DataPacket");
const Identifiers = require("./Identifiers");

class TimePacket extends DataPacket {
	static NETWORK_ID = Identifiers.TIME_PACKET;

	time;

	decodePayload() {}

	encodePayload() {
		this.writeIntLE(this.time)
	}
}

module.exports = TimePacket;
