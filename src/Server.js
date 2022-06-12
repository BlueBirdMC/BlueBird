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

const GamePacket = require("./network/mcpe/protocol/GamePacket");
const Config = require("./utils/Config");
const Lang = require("./utils/Lang");
const Logger = require("./utils/MainLogger");
const fs = require("fs");
const CommandMap = require("./command/CommandMap");
const DefaultCommandLoader = require("./command/DefaultCommandLoader");
const Player = require("./Player");
const MainLogger = require("./utils/MainLogger");
const RakNetHandler = require("./network/RakNetHandler");
const CommandSender = require("./command/CommandSender");
const ConsoleCommandSender = require("./command/ConsoleCommandSender");
const readline = require("readline");

class Server {
	/** @type {MainLogger} */
	logger;
	/** @type {RakNetHandler} */
	raknet;
	/** @type {String} */
	dataPath;
	/** @type {Config} */
	bluebirdcfg;
	/** @type {Lang} */
	bluebirdlang;
	/** @type {CommandMap} */
	commandMap;
	/** @type {string} */
	serverName;
	/** @type {string} */
	serverVersion;
	/** @type {Server|null} */
	static instance = null;

	/**
	 * @param {string} dataPath 
	 * @param {string} serverName
	 * @param {string} serverVersion
	 */
	constructor(dataPath, serverName, serverVersion) {
		if (Server.instance === null) {
			Server.instance = this;
		}
		this.logger = new Logger();
		this.commandMap = new CommandMap();
		this.dataPath = dataPath;
		this.serverName = serverName;
		this.serverVersion = serverVersion;
	}

	static getInstance() {
		if (Server.instance === null) {
			throw new Error("Instance is null");
		}
		return Server.instance();
	}

	/**
	 * @returns {void}
	 */
	start() {
		let start_time = Date.now();
		this.getLogger().info("Loading server...");
		this.getLogger().info("Loading BlueBird.json");
		if (!fs.existsSync("BlueBird.json")) {
			let content = {
				"motd": "BlueBird Server",
				"address": {
					"name": "0.0.0.0",
					"port": 19132,
					"version": 4,
				},
				"maxplayers": 20,
				"debug_level": 0,
				"xbox-auth": true
			};
			fs.writeFileSync("BlueBird.json", JSON.stringify(content, null, 4));
		}
		this.getLogger().info("Loading Lang.json");
		if (!fs.existsSync("Lang.json")) {
			let content = {
    				"kick_username_required": "Username is required",
    				"kick_xbox_auth_required": "Please login into your Xbox account or else...",
    				"kick_invalid_session": "Invalid session",
    				"kick_resource_pack_required": "You must accept resource packs to join this server.",
    				"kick_invalid_skin": "Invalid skin!",
    				"kick_incompatible_protocol": "Incompatible protocol",
    				"kick_kicked": "Kicked by {by}, reason: ${reason}"
			};
			fs.writeFileSync("Lang.json", JSON.stringify(content, null, 4));
		}
		this.bluebirdlang = new Config("Lang.json", Lang.TYPE_JSON);
		this.bluebirdcfg = new Config("BlueBird.json", Config.TYPE_JSON);
		this.getLogger().info(`This server is running ${this.serverName}, v${this.serverVersion}`);
		this.getLogger().info(`${this.serverName} is distributed under GPLv3 License`);
		let addrname = this.bluebirdcfg.getNested("address.name");
		let addrport = this.bluebirdcfg.getNested("address.port");
		let addrversion = this.bluebirdcfg.getNested("address.version"); // dont use config on here (u just wait)
		this.raknet = new RakNetHandler(this, addrname, addrport, addrversion);
		if (this.raknet.raknet.isRunning === true) {
			this.raknet.handle();
		}

		this.getLogger().info(`Server listened on ${addrname}:${addrport}, IpV: ${addrversion}`);

		DefaultCommandLoader.init(this);

		let sender = new ConsoleCommandSender(this);
		let rl = readline.createInterface({
			input: process.stdin
		});

		rl.on("line", (input) => {
			this.getCommandMap().dispatch(sender, input);
		});
		this.getLogger().info(`Done in ${(Date.now() - start_time)}ms.`);
	}

	/**
	 * @returns {CommandMap}
	 */
	getCommandMap() {
		return this.commandMap;
	}

	/**
	 * @param {string} name 
	 * @returns {Player}
	 */
	getPlayerByPrefix(name) {
		const player = this.getOnlinePlayers().find(player => player.getName().toLowerCase().startsWith(name.toLowerCase()));

		if (player == false){
			throw new Error(`Can't find player with name: ${name}`);
		}

		return player;
	}

	/**
	 * @param {string} name 
	 * @returns {Player}
	 */
	getPlayerByName(name) {
		const player = this.getOnlinePlayers().find(player => player.getName() === name);

		if (player == false){
			throw new Error(`Can't find player with name: ${name}`);
		}

		return player;
	}

	/**
	 * @param players {Player[]}
	 * @param packets {DataPacket[]}
	 * @param forceSync {Boolean}
	 * @param immediate {Boolean}
	 */
	broadcastGamePackets(players, packets, forceSync = false, immediate = false) {
		let targets = [];
		players.forEach(player => {
			if (player.isConnected()) {
				targets.push(this.raknet.players[player.connection.address.toString()]);
			}
		});

		if (targets.length > 0) {
			let pk = new GamePacket();

			packets.forEach(packet => pk.addPacket(packet));

			if (!forceSync && !immediate) {
				this.broadcastPackets([pk], targets, false);
			} else {
				this.broadcastPackets([pk], targets, immediate);
			}
		}
	}

	/**
	 * @returns {MainLogger}
	 */
	getLogger() {
		return this.logger;
	}

	/**
	 * @returns {void}
	 */
	shutdown() {
		this.raknet.shutdown();
		process.exit(1);
	}

	/**
	 * @return {Object}
	 */
	getOnlinePlayers() {
		return Object.values(this.raknet.players);
	}

	/**
	 * @param packets {DataPacket[]}
	 * @param targets {Player[]}
	 * @param immediate {Boolean}
	 */
	broadcastPackets(packets, targets, immediate) {
		packets.forEach(pk => {
			if (!pk.isEncoded) {
				pk.encode();
			}

			targets.forEach(player => {
				if (player.connection.address.toString() in this.raknet.players) {
					pk.sendTo(player, immediate);
				}
			});
		});
	}

	/**
	 * @param targets {Player[]}
	 * @param packet {DataPacket}
	 */
	broadcastPacket(targets, packet) {
		packet.encode();
		this.broadcastGamePackets(targets, [packet]);
	}

	/**
	 * @param message {String}
	 */
	broadcastMessage(message) {
		let onlinePlayers = this.getOnlinePlayers();
		for (const players of onlinePlayers) {
			players.sendMessage(message);
		}
	}
}

module.exports = Server;
