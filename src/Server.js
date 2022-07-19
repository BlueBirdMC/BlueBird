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
	constructor(a, c, b) {
		this.dataPath = a;
		this.serverName = c;
		this.serverVersion = b;
		this.logger = new Logger();
		this.commandMap = new CommandMap();
	}

	/**
	 * @param {Object} opt 
	 */
	static NewInstance(opt) {
		if (Server.instance !== null) {
			throw new Error("Instance is not null");
		}
		Server.instance = new Server(opt.DataPath, opt.ServerName, opt.ServerVersion);
		return Server.instance;
	}

	static getInstance() {
		if (Server.instance === null) {
			throw new Error("Instance is null");
		}
		return Server.instance;
	}

	/**
	 * @returns {void}
	 */
	start() {
		let start_time = Date.now();
		this.getLogger().info("Loading Server...");
		let contents = {
			Main: {
				"motd": "BlueBird Server",
				"address": {
					"name": "0.0.0.0",
					"port": 19132,
					"version": 4,
				},
				"etc": {
					"gamemode": 0,
					"player_x": 4.0,
					"player_y": 10.0,
					"player_z": 4.0,
					"player_yaw": 0.0,
					"player_pitch": 0.0,
					"spawn_dimension": 3,
					"world_gamemode": 0,
					"difficulty": 1,
					"spawn_x": 4.0,
					"spawn_y": 10.0,
					"spawn_z": 4.0,
					"stoptime": 0,
					"enable_commands": true,
					"texturepacksrequired": false,
					"permission_level": 2,
					"server_auth_inventory": false,
				},
				"maxplayers": 20,
				"debug_level": 0,
				"xbox-auth": true
			},
			Lang: {
				"kick_username_required": "Username is required",
				"kick_xbox_auth_required": "Please login into your Xbox account or else.",
				"kick_invalid_session": "Invalid session",
				"kick_resource_pack_required": "You must accept resource packs to join this server.",
				"kick_invalid_skin": "Invalid skin!",
				"kick_incompatible_protocol": "Incompatible protocol",
				"kick_kicked": "Kicked by ${by}, reason: ${reason}"
			},
			Files: {
				Main: "BlueBird.json",
				Lang: "Lang.json"
			}
		};
		for (const [type, name] of Object.entries(contents.Files)) {
			this.getLogger().info("Loading " + name);
			if (!fs.existsSync(name)) {
				fs.writeFileSync(name, JSON.stringify(contents[type], null, 4));
			}
		}
		this.bluebirdcfg = new Config("BlueBird.json", Config.TYPE_JSON);
		this.bluebirdlang = new Lang("Lang.json");
		this.getLogger().info(`This server is running ${this.serverName}, v${this.serverVersion}`);
		this.getLogger().info(`${this.serverName} is distributed under GPLv3 License`);
		let addrname = this.bluebirdcfg.getNested("address.name");
		let addrport = this.bluebirdcfg.getNested("address.port");
		let addrversion = this.bluebirdcfg.getNested("address.version");
		try {
			this.raknet = new RakNetHandler(this, addrname, addrport, addrversion);
		} catch (e) {
			this.getLogger().critical(`Raknet failed to start. Is the address configured correctly?`)
			this.getLogger().critical(`Unable to start server.`)
			process.exit(1)
		}
		if (this.raknet.raknet.isRunning === true) {
			this.raknet.handle();
		}
		//console.log(this.bluebirdcfg.getNested("etc.gamemode"))
		if (!this.bluebirdcfg.getNested("etc.gamemode") && !this.bluebirdcfg.getNested("etc.gamemode") === 0) {
			// Check if the config is from 1.0.10
			this.getLogger().warning(`[CONFIG ERROR] Your config is outdated!`);
			this.getLogger().warning(`[CONFIG ERROR] missing 'etc' category`)
			this.getLogger().critical(`Unable to start server.`)
			process.exit(1)
		};
		
		this.getLogger().info(`Server listened on ${addrname}:${addrport}, Address-Version: ${addrversion}`);

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
	 * @param  {Player[]} players
	 * @param  {DataPacket[]} packets
	 * @param  {Boolean} forceSync
	 * @param  {Boolean} immediate
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
	 * @param {DataPacket[]} packets
	 * @param {Player[]} targets
	 * @param {Boolean} immediate
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
	 * @param {Player[]} targets
	 * @param {DataPacket} packet
	 */
	broadcastPacket(targets, packet) {
		packet.encode();
		this.broadcastGamePackets(targets, [packet]);
	}

	/**
	 * @param {String} message
	 */
	broadcastMessage(message) {
		for (const players of this.getOnlinePlayers()) {
			players.sendMessage(message);
		}
	}
}

module.exports = Server;
