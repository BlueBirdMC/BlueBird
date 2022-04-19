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

const { RakNetServer, InternetAddress, Frame, ReliabilityTool } = require("bbmc-raknet");
const GamePacket = require("./mcpe/protocol/GamePacket");
const Logger = require("../utils/MainLogger");
const PacketPool = require("./mcpe/protocol/PacketPool");
const BinaryStream = require("bbmc-binarystream");
const Identifiers = require("./mcpe/protocol/Identifiers");
const Player = require("../Player");
const DataPacket = require("./mcpe/protocol/DataPacket");

class RakNetHandler {
	/** @type {MainLogger} */
	logger;
	/** @type {PlayerList} */
	players;
	/** @type {RakNetServer, EventEmitter} */
	raknet;
	/** @type {Server} */
	server;
	/** @type {Object} */
	players = {};

	static MCPE_PROTOCOL_VERSION = 10;

	/**
	 * 
	 * @param {Server} server 
	 * @param {string} AddrName 
	 * @param {number} AddrPort 
	 * @param {number} AddrVersion 
	 */
	constructor(server, AddrName, AddrPort, AddrVersion) {
		PacketPool.init();
		this.server = server;
		this.logger = new Logger();
		this.raknet = new RakNetServer(new InternetAddress(
			AddrName,
			AddrPort,
			AddrVersion),
			RakNetHandler.MCPE_PROTOCOL_VERSION
		);
		this.logger.setDebuggingLevel(this.server.bluebirdcfg.get("debug_level"));
	}

	/**
	 * @param {Player} player 
	 * @param {DataPacket} packet 
	 * @param {Boolean} immediate 
	 */
	queuePacket(player, packet, immediate) {
		if (player.connection.address.toString() in this.players) {
			if (!packet.isEncoded) {
				packet.encode();
			}
			if (packet instanceof GamePacket) {
				let frame = new Frame();
				frame.reliability = ReliabilityTool.UNRELIABLE;
				frame.isFragmented = false;
				frame.stream = new BinaryStream(packet.buffer);
				player.connection.addToQueue(frame);
			} else {
				this.server.broadcastGamePackets([player], [packet], true, immediate);
			}
		}
	}

	handle() {
		let interval = setInterval(() => {
			if(this.raknet.isRunning === true){
				this.raknet.message = `MCPE;${this.server.bluebirdcfg.get('motd')};${Identifiers.CURRENT_PROTOCOL};${Identifiers.MINECRAFT_VERSION};${this.server.getOnlinePlayers().length};${this.server.bluebirdcfg.get('maxplayers')};${this.raknet.serverGUID.toString()};`;
			}else{
				clearInterval(interval);
			}
		});

		this.raknet.on('connect', (connection) => {
			let player = new Player(this.server, connection);
			if(!(connection.address.toString() in this.players)){
				this.players[connection.address.toString()] = player;
			}
		});

		this.raknet.on('disconnect', (address) => {
			if (address.toString() in this.players) {
				delete this.players[address.toString()];
			}
		});

		this.raknet.on('packet', (stream, connection) => {
			if(connection.address.toString() in this.players){
				let player = this.players[connection.address.toString()];
				let packet = new GamePacket();
				packet.buffer = stream.buffer;
				packet.decode();
				packet.handle(player.getNetworkSession());
			}
		});
	}

	/**
	 * @param {InternetAddress} address 
	 * @param {string} reason 
	 */
	close(address, reason) {
		if (address.toString() in this.players) {
			this.players[address.toString()].disconnect(reason);
		}
	}

	shutdown() {
		this.raknet.isRunning = false;
	}
}

module.exports = RakNetHandler;
