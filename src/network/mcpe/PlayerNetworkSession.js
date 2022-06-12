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

const { TextFormat } = require("../../utils/TextFormat");
const DataPacket = require("./protocol/DataPacket");
const TextPacket = require("./protocol/TextPacket");
const SkinAdapterSingleton = require("./protocol/types/SkinAdapterSingleton");
const Player = require("../../Player");

class PlayerNetworkSession {
	/** @type {Server} */
	server;
	/** @type {Player} */
	player;

	/**
	 * @param {Player} player
	 */
	constructor(player) {
		this.server = player.server;
		this.player = player;
	}

	/**
	 * @param {DataPacket} packet 
	 * @returns 
	 */
	handleDataPacket(packet) {
		if (!packet instanceof DataPacket) {
			throw new Error("expected a packet instanceof DataPacket got " + packet);
		}

		if (!this.player.isConnected()) {
			return;
		}

		packet.decode();

		if (!packet.feos() && !packet.mayHaveUnreadBytes) {
			const remains = packet.buffer.slice(packet.offset);
			this.server.logger.debug("Still " + remains.length + " bytes unread in " + packet.getName() + ": 0x" + remains.toString("hex"));
		}

		packet.handle(this);
	}

	handleLogin(packet) {
		this.player.handleLogin(packet);
		return true;
	}

	handleText(packet) {
		if (packet.type === TextPacket.TYPE_CHAT){
			this.player.chat(TextFormat.clean(packet.message))
		}
		return true;
	}

	handleResourcePackClientResponse(packet) {
		this.player.handleResourcePackClientResponse(packet);
		return true;
	}

	handlePlayerSkin(packet) {
		this.player.changeSkin(SkinAdapterSingleton.get().fromSkinData(packet.skin), packet.oldSkinName, packet.skinName);
		return true;
	}

	handleModalFormResponse(packet) {
		return true;
	}

	/**
	 * @return {String}
	 */
	toString() {
		return this.player.getName() !== "" ? this.player.getName() : this.player.connection.address.toString();
	}
}

module.exports = PlayerNetworkSession;
