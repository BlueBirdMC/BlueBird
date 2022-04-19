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

const PlayerNetworkSession = require("./network/mcpe/PlayerNetworkSession");
const ProtocolInfo = require("./network/mcpe/protocol/Identifiers");
const PlayStatusPacket = require("./network/mcpe/protocol/PlayStatusPacket");
const StartGamePacket = require("./network/mcpe/protocol/StartGamePacket");
const ResourcePackClientResponsePacket = require("./network/mcpe/protocol/ResourcePackClientResponsePacket");
const ResourcePackStackPacket = require("./network/mcpe/protocol/ResourcePackStackPacket");
const TextFormat = require("./utils/TextFormat");
const ResourcePacksInfoPacket = require("./network/mcpe/protocol/ResourcePacksInfoPacket");
const BiomeDefinitionListPacket = require("./network/mcpe/protocol/BiomeDefinitionListPacket");
const CreativeContentPacket = require("./network/mcpe/protocol/CreativeContentPacket");
const TextPacket = require("./network/mcpe/protocol/TextPacket");
const SetTitlePacket = require("./network/mcpe/protocol/SetTitlePacket");
const DisconnectPacket = require("./network/mcpe/protocol/DisconnectPacket");
const UUID = require("./utils/UUID");
const SkinAdapterSingleton = require("./network/mcpe/protocol/types/SkinAdapterSingleton");
const SkinImage = require("./network/mcpe/protocol/types/SkinImage");
const SkinAnimation = require("./network/mcpe/protocol/types/SkinAnimation");
const PersonaSkinPiece = require("./network/mcpe/protocol/types/PersonaSkinPiece");
const PersonaPieceTintColor = require("./network/mcpe/protocol/types/PersonaPieceTintColor");
const SkinData = require("./network/mcpe/protocol/types/SkinData");
const Utils = require("./utils/Utils");
const Skin = require("./entity/Skin");
const { Connection } = require("bbmc-raknet");
const Server = require("./Server");
const LoginPacket = require("./network/mcpe/protocol/LoginPacket");
const DataPacket = require("./network/mcpe/protocol/DataPacket");
const Human = require("./entity/Human");

class Player extends Human {

	/** @type {string} */
	username = "";
	/** @type {Boolean} */
	loggedIn = false;
	/** @type {string} */
	languageCode = "en_US";
	/** @type {UUID} */
	uuid;
	/** @type {PlayerNetworkSession} */
	networkSession;
	/** @type {string} */
	xuid;
	/** @type {number} */
	clientId;
	/** @type {Boolean} */
	authorized;
	/** @type {Connection} */
	connection;

	/**
	 * @param {Server} server 
	 * @param {Connection} connection 
	 */
	constructor(server, connection) {
		super(server, null);
		this.server = server;
		this.connection = connection;
		this.networkSession = new PlayerNetworkSession(this);
	}

	/**
	 * @return {PlayerNetworkSession}
	 */

	getNetworkSession() {
		return this.networkSession;
	}

	/**
	 * @returns {Boolean}
	 */
	isConnected() {
		return this.networkSession !== null;
	}

	/**
	 * @param {Skin} skin 
	 * @param {string} oldSkinName 
	 * @param {string} newSkinName 
	 * @returns {void}
	 */
	changeSkin(skin, oldSkinName, newSkinName) {
		if (!skin.isValid()) {
			return;
		}

		// this.server.broadcastMessage(`${this.getName()} changed his skin from ${oldSkinName} to ${newSkinName}`);

		this.setSkin(skin);
		this.sendSkin(this.server.getOnlinePlayers());
	}

	/**
	 * @param {LoginPacket} packet 
	 * @returns {void}
	 */
	handleLogin(packet) {
		if (packet.protocol !== ProtocolInfo.CURRENT_PROTOCOL) {
			if (packet.protocol < ProtocolInfo.CURRENT_PROTOCOL) {
				this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_CLIENT, true);
			} else {
				this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_SERVER, true);
			}

			this.close("Incompatible protocol");
			return;
		}

		this.username = TextFormat.clean(packet.username);
		this.clientId = packet.clientId;

		if (packet.languageCode !== null) {
			this.languageCode = packet.languageCode;
		}

		this.uuid = UUID.fromString(packet.clientUUID);

		let animations = [];

		packet.clientData["AnimatedImageData"].forEach(animation => {
			animations.push(new SkinAnimation(
				new SkinImage(
					animation["ImageHeight"],
					animation["ImageWidth"],
					Utils.base64_decode(animation["Image"], true)),
				animation["Type"],
				animation["Frames"],
				animation["AnimationExpression"]
			));
		});

		let personaPieces = [];

		packet.clientData["PersonaPieces"].forEach(piece => {
			personaPieces.push(new PersonaSkinPiece(
				piece["PieceId"],
				piece["PieceType"],
				piece["PackId"],
				piece["IsDefault"],
				piece["ProductId"]
			));
		});

		let pieceTintColors = [];

		packet.clientData["PieceTintColors"].forEach(tintColors => {
			pieceTintColors.push(new PersonaPieceTintColor(tintColors["PieceType"], tintColors["Colors"]));
		});

		let skinData = new SkinData(
			packet.clientData["SkinId"],
			packet.clientData["PlayFabId"],
			Utils.base64_decode(packet.clientData["SkinResourcePatch"] ? packet.clientData["SkinResourcePatch"] : "", true),
			new SkinImage(
				packet.clientData["SkinImageHeight"],
				packet.clientData["SkinImageWidth"],
				Utils.base64_decode(packet.clientData["SkinData"], true)
			),
			animations,
			new SkinImage(
				packet.clientData["CapeImageHeight"],
				packet.clientData["CapeImageWidth"],
				Utils.base64_decode(packet.clientData["CapeData"] ? packet.clientData["CapeData"] : "", true)
			),
			Utils.base64_decode(packet.clientData["SkinGeometryData"] ? packet.clientData["SkinGeometryData"] : "", true),
			Utils.base64_decode(packet.clientData["SkinGeometryDataEngineVersion"], true),
			Utils.base64_decode(packet.clientData["SkinAnimationData"] ? packet.clientData["SkinAnimationData"] : "", true),
			packet.clientData["CapeId"] ? packet.clientData["CapeId"] : "",
			null,
			packet.clientData["ArmSize"] ? packet.clientData["ArmSize"] : SkinData.ARM_SIZE_WIDE,
			packet.clientData["SkinColor"] ? packet.clientData["SkinColor"] : "",
			personaPieces,
			pieceTintColors,
			true,
			packet.clientData["PremiumSkin"] ? packet.clientData["PremiumSkin"] : false,
			packet.clientData["PersonaSkin"] ? packet.clientData["PersonaSkin"] : false,
			packet.clientData["CapeOnClassicSkin"] ? packet.clientData["CapeOnClassicSkin"] : false,
			true
		);

		let skin;
		try {
			skin = SkinAdapterSingleton.get().fromSkinData(skinData);
			skin.validate();
		} catch (e) {
			console.log(e);
			this.close("Invalid Skin");
			return;
		}

		// this.changeSkin(skin, "", "");
		this.setSkin(skin);

		this.onVerifyCompleted(packet, null, true);
	}

	/**
	 * @param {ResourcePackClientResponsePacket} packet 
	 * @returns {Boolean}
	 */
	handleResourcePackClientResponse(packet) {
		switch (packet.status) {
			case ResourcePackClientResponsePacket.STATUS_REFUSED:
				this.close("You must accept resource packs to join this server.");
				break;

			case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
				break;

			case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
				let resource_pack_stack_packet = new ResourcePackStackPacket();
				resource_pack_stack_packet.resourcePackStack = [];
				resource_pack_stack_packet.mustAccept = false;
				this.sendDataPacket(resource_pack_stack_packet);
				break;

			case ResourcePackClientResponsePacket.STATUS_COMPLETED:
				let start_game_packet = new StartGamePacket();
				start_game_packet.entityId = this.id;
				start_game_packet.entityRuntimeId = this.id;
				this.sendDataPacket(start_game_packet);

				this.sendDataPacket(new BiomeDefinitionListPacket());
				this.sendDataPacket(new CreativeContentPacket());

				this.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);
				break;
		}
	}

	/**
	 * 
	 * @param {LoginPacket} packet 
	 * @param {string} error 
	 * @param {Boolean} signedByMojang 
	 * @returns {void}
	 */
	onVerifyCompleted(packet, error, signedByMojang) {
		if (error !== null) {
			this.close("Invalid session");
			return;
		}

		let xuid = packet.xuid;

		if (!signedByMojang && xuid) {
			this.server.getLogger().info(`${this.username} has an XUID, but his login keychain is not signed by microsoft`);
			this.authorized = false;
			if (this.server.bluebirdcfg.get("xbox-auth") === true) {
				this.server.getLogger().debug(`${this.username} is not logged into Xbox Live`);
				this.close("To join this server you must login to your xbox account");
				return;
			}
			xuid = "";
		}

		if (!this.username) {
			this.close("Username is required");
			return;
		}

		if (!xuid || !xuid instanceof String) {
			if (signedByMojang) {
				this.server.getLogger().warning(`${this.username} tried to join without XUID`);
				this.authorized = false;
				if (this.server.bluebirdcfg.get("xbox-auth") === true) {
					this.close("To join this server you must login to your xbox account");
					return;
				}
			}
			this.server.getLogger().debug(`${this.username} is not logged in xbox Live`);
		} else {
			this.authorized = true;
			this.server.getLogger().debug(`${this.username} is logged in xbox Live`);
		}

		this.xuid = xuid;

		this.loggedIn = true;

		this.sendPlayStatus(PlayStatusPacket.LOGIN_SUCCESS);

		let packsInfo = new ResourcePacksInfoPacket();
		packsInfo.resourcePackEntries = [];
		packsInfo.mustAccept = false;
		packsInfo.forceServerPacks = false;
		this.sendDataPacket(packsInfo);

		this.server.getLogger().info(`Player ${this.username} joined the game`);
		this.server.broadcastMessage(`§ePlayer ${this.username} joined the game`);
	}

	/**
	 * @param {string} message 
	 * @returns {void}
	 */
	chat(message) {
		message = message.split("\n");
		for (let i in message) {
			let messageElement = message[i];
			if (messageElement.trim() !== "" && messageElement.length <= 255) {
				if (messageElement.startsWith("/")) {
					//TODO: Send Command Packet
					return;
				}
				let msg = "<:player> :message".replace(":player", this.getName()).replace(":message", messageElement);
				this.server.broadcastMessage(msg);
				this.server.getLogger().info(msg);
			}
		}
	}

	/**
	 * @param {string} message 
	 */
	sendMessage(message) {
		let pk = new TextPacket();
		pk.type = TextPacket.TYPE_RAW;
		pk.message = message;
		this.sendDataPacket(pk);
	}

	/**
	 * @param {string} title 
	 * @param {string} subtitle 
	 * @param {number} fadeIn 
	 * @param {number} stay 
	 * @param {number} fadeOut 
	 */
	sendTitle(title, subtitle = "", fadeIn = -1, stay = -1, fadeOut = -1) {
		this.setTitleDuration(fadeIn, stay, fadeOut);
		if (subtitle !== "") {
			this.sendSubTitle(subtitle);
		}
		this.sendTitleText(title, SetTitlePacket.TYPE_SET_TITLE);
	}

	/**
	 * @param {string} subtitle 
	 */
	sendSubTitle(subtitle) {
		this.sendTitleText(subtitle, SetTitlePacket.TYPE_SET_SUBTITLE);
	}

	/** clear the player titles */
	clearTitles() {
		let pk = new SetTitlePacket();
		pk.type = SetTitlePacket.TYPE_CLEAR_TITLE;
		this.sendDataPacket(pk);
	}

	/** reset the player titles */
	resetTitles() {
		let pk = new SetTitlePacket();
		pk.type = SetTitlePacket.TYPE_RESET_TITLE;
		this.sendDataPacket(pk);
	}

	/**
	 * @param {number} fadeIn 
	 * @param {number} stay 
	 * @param {number} fadeOut 
	 */
	setTitleDuration(fadeIn, stay, fadeOut) {
		if (fadeIn >= 0 && stay >= 0 && fadeOut >= 0) {
			let pk = new SetTitlePacket();
			pk.type = SetTitlePacket.TYPE_SET_ANIMATION_TIMES;
			pk.fadeInTime = fadeIn;
			pk.stayTime = stay;
			pk.fadeOutTime = fadeOut;
			this.sendDataPacket(pk);
		}
	}

	/**
	 * @param {string} title 
	 * @param {number} type 
	 */
	sendTitleText(title, type) {
		let pk = new SetTitlePacket();
		pk.type = type;
		pk.text = title;
		this.sendDataPacket(pk);
	}

	/**
	 * @param {number} status 
	 * @param {Boolean} immediate 
	 */
	sendPlayStatus(status, immediate = false) {
		let play_status_packet = new PlayStatusPacket();
		play_status_packet.status = status;
		this.sendDataPacket(play_status_packet, immediate);
	}

	/**
	 * @param {string} reason 
	 * @param {Boolean} hide_disconnection_screen 
	 */
	close(reason, hide_disconnection_screen = false) {
		this.server.getLogger().info("Player " + this.username + " disconnected due to " + reason);
		this.server.broadcastMessage("§ePlayer " + this.username + " left the game");
		let pk = new DisconnectPacket();
		pk.hideDisconnectionScreen = hide_disconnection_screen;
		pk.message = reason;
		this.sendDataPacket(pk);
		this.connection.disconnect(reason);
	}

	kick(reason, by){
		this.close(`Kicked by ${by}, reason: ${reason}`);
	}

	/**
	 * @returns {string}
	 */
	getXuid() {
		return this.xuid;
	}

	/**
	 * @returns {number}
	 */
	getClientId() {
		return this.clientId;
	}

	/**
	 * @returns {Boolean}
	 */
	isAuthorized() {
		return this.authorized;
	}

	/**
	 * @returns {UUID}
	 */
	getUUID() {
		return this.uuid;
	}

	/**
	 * @returns {string}
	 */
	getName() {
		return this.username;
	}

	/**
	 * @param {DataPacket} packet 
	 * @param {Boolean} immediate 
	 * @returns {void}
	 */
	sendDataPacket(packet, immediate = false) {
		if (!this.isConnected()) return;

		if (!this.loggedIn && !packet.canBeSentBeforeLogin) {
			throw new Error(`Attempted to send ${packet.getName()} to ${this.networkSession.toString()} before he got logged in`);
		}

		this.server.raknet.queuePacket(this, packet, immediate);
	}
}

module.exports = Player;
