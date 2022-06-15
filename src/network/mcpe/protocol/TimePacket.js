// This file was created by PurpleBird team
// @author PurpleBirdMC
// @author andriycraft

const DataPacket = require("./DataPacket");
const Identifiers = require("./Identifiers");

class TimePacket extends DataPacket {
	static NETWORK_ID = Identifiers.TIME_PACKET;

	time = 17000;

	decodePayload() {}

	encodePayload() {
		this.writeSignedVarInt(this.time)
	}
}

module.exports = TimePacket;
