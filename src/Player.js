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
const Identifiers = require("./network/mcpe/protocol/Identifiers");
const PlayStatusPacket = require("./network/mcpe/protocol/PlayStatusPacket");
const StartGamePacket = require("./network/mcpe/protocol/StartGamePacket");
const ResourcePackClientResponsePacket = require("./network/mcpe/protocol/ResourcePackClientResponsePacket");
const ResourcePackStackPacket = require("./network/mcpe/protocol/ResourcePackStackPacket");
const TimePacket = require("./network/mcpe/protocol/TimePacket");
const { TextFormat } = require("./utils/TextFormat");
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
const Human = require("./entity/Human");
const { ModalFormRequestPacket } = require("./network/mcpe/protocol/FormPackets");
const mineflayer = require('mineflayer')

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
	/** @type {Server} */
	server;

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
		this.server.getLogger().warning(`[Purple Bird] ${this.username} tried to change his skin, but changing skins are not supported on java servers`);
		this.sendMessage(this.server.bluebirdlang.get("msg_skins_notsupported"))
	}

	/**
	 * @param {LoginPacket} packet 
	 * @returns {void}
	 */
	handleLogin(packet) {

		this.username = TextFormat.clean(packet.username);
		this.clientId = packet.clientId;

		this.server.getLogger().info(`New connection from ${this.username} [/${this.connection.address.toString()}]`);

		//if (packet.protocol !== Identifiers.CURRENT_PROTOCOL) {
		//	this.close()
		//	return;
		//}	

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

		const skinData = new SkinData(
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
			this.server.getLogger.warn(`${this.username} has invalid skin: ${e}`)
			this.close(this.server.bluebirdlang.get("kick_invalid_skin"));
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
				this.close(this.server.bluebirdlang.get("kick_resource_pack_required"));
				break;

			case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
				break;

			case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
				const packet = new ResourcePackStackPacket();
				packet.resourcePackStack = [];
				packet.mustAccept = false;
				packet.sendTo(this);
				break;

			case ResourcePackClientResponsePacket.STATUS_COMPLETED:
				const packet1 = new StartGamePacket();
				packet1.entityId = this.id;
				packet1.entityRuntimeId = this.id;
				packet1.sendTo(this);

				const [biome_pk, creative_ct_pk] = [new BiomeDefinitionListPacket(), new CreativeContentPacket()];
				biome_pk.sendTo(this);
				creative_ct_pk.sendTo(this);

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
		let addr = this.server.purplebirdcfg.getNested("target.host");
		let port = this.server.purplebirdcfg.getNested("target.port");
		let prefix = this.server.purplebirdcfg.getNested("players.prefix");
		let ver = this.server.purplebirdcfg.getNested("target.version");
		try {
		if (error !== null) {
			this.close(this.server.bluebirdlang.get("kick_invalid_session"));
			return;
		}

		let xuid = packet.xuid;

		if (!signedByMojang && xuid) {
			this.server.getLogger().info(`${this.username} has an XUID, but his login keychain is not signed by microsoft`);
			this.authorized = false;
			if (this.server.bluebirdlang.get("xbox-auth") === true) {
				this.server.getLogger().debug(`${this.username} is not logged into Xbox Live`);
				this.close(this.server.bluebirdlang.get("kick_xbox_auth_required"));
				return;
			}
			xuid = "";
		}

		if (!this.username) {
			this.close(this.server.bluebirdlang.get("kick_username_required"));
			return;
		}

		if (!xuid || !xuid instanceof String) {
			if (signedByMojang) {
				this.server.getLogger().warning(`${this.username} tried to join without XUID`);
				this.authorized = false;
				if (this.server.bluebirdlang.get("xbox-auth") === true) {
					this.close(this.server.bluebirdlang.get("kick_xbox_auth_required"));
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

		const packet3 = new ResourcePacksInfoPacket();
		packet3.resourcePackEntries = [];
		packet3.mustAccept = false;
		packet3.forceServerPacks = false;
		packet3.sendTo(this);

		this.server.getLogger().info(`[PurpleBird] Creating connection, please wait...`);
		
		this.server.getLogger().debug(`
		ADDR: ${addr},
		PORT: ${port},
		PREFIX: ${prefix},
		VER: ${ver}
		`)


		this.bot = mineflayer.createBot({
		  host: addr,
		  username: prefix + this.username,
		  port: port,
		  version: ver
		})

		this.bot.on('kicked', (reason) => {
			let full;
			if (!reason) {
				full = this.server.bluebirdlang.get("kick_targeterror");
			}
			else {
				full = reason.replace(`{"text":"`, "").replace(`"}`, "").replace(`"`, "").replace(`"`, "").replace(`\n`, "\n")
			}
			this.close("", full)
			return;
		})
		

		this.bot._client.on('packet', (packet) => {
			if (packet.age && packet.time) {
				let time = new TimePacket();
				time.time1 = packet.time;
				time.sendTo(this);
			}
		})

		this.bot.on('error', () => {
			this.close("", this.server.bluebirdlang.get("kick_targeterror"))
			return;
		})
		

		this.bot.once('spawn', () => {
			this.server.getLogger().info(`[PurpleBird] Connection created`)
		})

		
	} catch (e) { this.server.getLogger().error(e) }
	}

	/**
	 * @param {string} message 
	 * @returns {void}
	 */
	chat(message) {
		message = message.split("\n");
		for (let i in message) {
			let messageElement = message[i];
			if (messageElement.trim() !== "" && messageElement.length < 255) {
				try {
					if (messageElement.startsWith("./")) {
						this.bot.chat('/' + messageElement.replace('./', '/'))
						return;
					}
					this.bot.chat(messageElement)
				} catch (e) {}
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
		pk.sendTo(this);
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
		pk.sendTo(this);
	}

	/** reset the player titles */
	resetTitles() {
		const pk = new SetTitlePacket();
		pk.type = SetTitlePacket.TYPE_RESET_TITLE;
		pk.sendTo(this);
	}

	/**
	 * @param {number} fadeIn 
	 * @param {number} stay 
	 * @param {number} fadeOut 
	 */
	setTitleDuration(fadeIn, stay, fadeOut) {
		if (fadeIn >= 0 && stay >= 0 && fadeOut >= 0) {
			const pk = new SetTitlePacket();
			pk.type = SetTitlePacket.TYPE_SET_ANIMATION_TIMES;
			pk.fadeInTime = fadeIn;
			pk.stayTime = stay;
			pk.fadeOutTime = fadeOut;
			pk.sendTo(this);
		}
	}

	/**
	 * @param {string} title 
	 * @param {number} type 
	 */
	sendTitleText(title, type) {
		const pk = new SetTitlePacket();
		pk.type = type;
		pk.text = title;
		pk.sendTo(this);
	}

	/**
	 * @param {number} status 
	 * @param {Boolean} immediate 
	 */
	sendPlayStatus(status, immediate = false) {
		const packet = new PlayStatusPacket();
		packet.status = status;
		packet.sendTo(this, immediate);
	}

	/**
	 * @param {string} message
	 * @param {string} reason
	 * @param {bool} onlymsg
	 */
	close(message = "", reason, onlymsg = false) {
		if (reason !== "client disconnection") {
			this.server.getLogger().info("Player " + this.username + " disconnected due to " + reason);
			this.server.getLogger().info("[PurpleBird] Disconnecting from server...");
		}
		try {
			this.bot.quit()
			this.server.getLogger().info("[PurpleBird] Disconnected!");
		} catch (e) {}
		if(onlymsg === false){
			const pk = new DisconnectPacket();
			pk.hideDisconnectionScreen = false;
			pk.message = reason;
			pk.sendTo(this);
			this.connection.disconnect(reason);
		}
	}

	kick(reason, by){
		this.close("", this.server.bluebirdlang.get("kick_kicked").replace("{by}", by).replace("{reason}", reason));
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
}

module.exports = Player;
