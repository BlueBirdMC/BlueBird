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

const BinaryStream = require("../../NetworkBinaryStream");
const Utils = require("../../../utils/Utils");

class LoginPacket extends DataPacket {
	static NETWORK_ID = Identifiers.LOGIN_PACKET;

	/** @type {string} */
	username = "";
	/** @type {number|undefined} */
	protocol;
	/** @type {string} */
	clientUUID;
	/** @type {string} */
	xuid;
	/** @type {string} */
	identityPublicKey;
	/** @type {string} */
	serverAddress;
	/** @type {string} */
	languageCode;
	/** @type {any} */
	chainData;
	/** @type {string} */
	clientDataJwt;
	/** @type {any} */
	clientData;

	canBeSentBeforeLogin = true;

	mayHaveUnreadBytes = this.protocol !== Identifiers.CURRENT_PROTOCOL;

	decodePayload() {
		this.protocol = this.readIntBE();

		try {
			this.decodeConnectionRequest();
		} catch (e) {
			throw new Error(`${this.constructor.name} was thrown while decoding connection request in login (protocol version ${this.protocol})`);
		}
	}

	decodeConnectionRequest() {
		let buffer = new BinaryStream(this.read(this.readVarInt()));
		this.chainData = JSON.parse(buffer.read(buffer.readIntLE()).toString());

		let hasExtraData = false;
		this.chainData["chain"].forEach((chain) => {
			let webtoken = Utils.decodeJWT(chain);
			if (typeof webtoken["extraData"] !== "undefined") {
				if (hasExtraData) {
					throw new Error("Found 'extraData' multiple times in key chain");
				}

				hasExtraData = true;

				if (typeof webtoken["extraData"]["displayName"] !== "undefined") {
					this.username = webtoken["extraData"]["displayName"];
				}
				if (typeof webtoken["extraData"]["identity"] !== "undefined") {
					this.clientUUID = webtoken["extraData"]["identity"];
				}
				if (typeof webtoken["extraData"]["XUID"] !== "undefined") {
					this.xuid = webtoken["extraData"]["XUID"];
				}
			}

			if (typeof webtoken["identityPublicKey"] !== "undefined") {
				this.identityPublicKey = webtoken["identityPublicKey"];
			}
		});

		this.clientDataJwt = buffer.read(buffer.readIntLE()).toString();
		this.clientData = Utils.decodeJWT(this.clientDataJwt);

		this.clientId = this.clientData["ClientRandomId"] ? this.clientData["ClientRandomId"] : null;
		this.serverAddress = this.clientData["ServerAddress"] ? this.clientData["ServerAddress"] : null;

		this.languageCode = this.clientData["LanguageCode"] ? this.clientData["LanguageCode"] : null;
	}

	handle(handler) {
		return handler.handleLogin(this);
	}
}

module.exports = LoginPacket;
