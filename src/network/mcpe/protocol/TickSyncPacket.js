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

class TickSyncPacket extends DataPacket {
	static NETWORK_ID = Identifiers.TICK_SYNC_PACKET;

    clientRequestTimestamp;
    serverReceptionTimestamp;

	decodePayload() {
		this.clientRequestTimestamp = this.readLongLE();
        this.serverReceptionTimestamp = this.readLongLE();
	}

	encodePayload() {
		this.writeLongLE(this.clientRequestTimestamp);
		this.writeLongLE(this.serverReceptionTimestamp);
	}
}

module.exports = TickSyncPacket;