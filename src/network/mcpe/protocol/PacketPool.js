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

const LoginPacket = require("./LoginPacket");
const PlayStatusPacket = require("./PlayStatusPacket");
const ResourcePackClientResponsePacket = require("./ResourcePackClientResponsePacket");
const ResourcePacksInfoPacket = require("./ResourcePacksInfoPacket");
const ResourcePackStackPacket = require("./ResourcePackStackPacket");
const StartGamePacket = require("./StartGamePacket");
const CreativeContentPacket = require("./CreativeContentPacket");
const BiomeDefinitionListPacket = require("./BiomeDefinitionListPacket");
const TextPacket = require("./TextPacket");
const SetTitlePacket = require("./SetTitlePacket");
const DisconnectPacket = require("./DisconnectPacket");
const PlayerSkinPacket = require("./PlayerSkinPacket");
const SetLocalPlayerAsInitializedPacket = require("./SetLocalPlayerAsInitializedPacket");
const ToastRequestPacket = require("./ToastRequestPacket");
const { ModalFormRequestPacket, ModalFormResponsePacket } = require("./FormPackets");
const TransferPacket = require("./TransferPacket");
const TickSyncPacket = require("./TickSyncPacket");
const RequestChunkRadiusPacket = require("./RequestChunkRadiusPacket");
const ClientCacheStatusPacket = require("./ClientCacheStatusPacket");

class PacketPool {

	static #pool = {};

	static init() {
		this.register(LoginPacket);
		this.register(PlayStatusPacket);
		this.register(ResourcePacksInfoPacket);
		this.register(ResourcePackClientResponsePacket);
		this.register(ResourcePackStackPacket);
		this.register(StartGamePacket);
		this.register(BiomeDefinitionListPacket);
		this.register(CreativeContentPacket);
		this.register(TextPacket);
		this.register(SetTitlePacket);
		this.register(DisconnectPacket);
		this.register(SetLocalPlayerAsInitializedPacket);
		this.register(PlayerSkinPacket);
		this.register(ToastRequestPacket);
		this.register(TransferPacket);
		this.register(TickSyncPacket);
		this.register(ModalFormRequestPacket);
		this.register(ModalFormResponsePacket);
		this.register(RequestChunkRadiusPacket);
		this.register(ClientCacheStatusPacket);
	}

	static register(packet) {
		if(packet.NETWORK_ID in this.#pool){
			throw new Error(`Trying to register already registered packet, packetid=${packet.NETWORK_ID}`);
		}
		this.#pool[packet.NETWORK_ID] = packet;
	}

	static getPacket(id) {
		let packet = this.#pool[id];
		return typeof this.#pool[id] !== "undefined" ? new packet : false;
	}
}

module.exports = PacketPool;
