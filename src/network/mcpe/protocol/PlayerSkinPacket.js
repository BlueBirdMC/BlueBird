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

class PlayerSkinPacket extends DataPacket {
	static NETWORK_ID = Identifiers.PLAYER_SKIN_PACKET;

	uuid;
	skin;
	skinName;
	oldSkinName;
	isVerified;

	decodePayload() {
		this.uuid = this.readUUID();
		this.skin = this.readSkin();
		this.skinName = this.readString();
		this.oldSkinName = this.readString();
		this.isVerified = this.readBool();
	}

	encodePayload() {
		this.writeUUID(this.uuid);
		this.writeSkin(this.skin);
		this.writeString(this.skinName);
		this.writeString(this.oldSkinName);
		this.writeBool(this.isVerified);
	}

	handle(handler) {
		return handler.handlePlayerSkin(this);
	}
}

module.exports = PlayerSkinPacket;
