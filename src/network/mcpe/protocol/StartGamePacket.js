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
const UUID = require("../../../utils/UUID")

class StartGamePacket extends DataPacket {
	static NETWORK_ID = Identifiers.START_GAME_PACKET;

	canBeSentBeforeLogin = true;

	entityId;
	entityRuntimeId;

	encodePayload() {
		this.writeSignedVarLong(this.entityId); // Entity id
		this.writeVarLong(this.entityRuntimeId); // Runtime entity id
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.gamemode")); // Player gamemode

		this.writeFloatLE(this.server.bluebirdcfg.getNested("etc.player_x")); // Player x
		this.writeFloatLE(this.server.bluebirdcfg.getNested("etc.player_y")); // Player y
		this.writeFloatLE(this.server.bluebirdcfg.getNested("etc.player_z")); // PLayer z

		this.writeFloatLE(this.server.bluebirdcfg.getNested("etc.player_pitch")); // Pitch
		this.writeFloatLE(this.server.bluebirdcfg.getNested("etc.player_yaw")); // Yaw

		this.writeLongLE(0n); // Seed
		this.writeShortLE(0); // Biome type
		this.writeString(""); // Biome name
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.spawn_dimension")); // Dimension
		this.writeSignedVarInt(1); // Generator
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.world_gamemode")); // World gamemode
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.difficulty")); // Difficulty
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.spawn_x")); // Spawn x
		this.writeVarInt(this.server.bluebirdcfg.getNested("etc.spawn_y")); // Spawn y
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.spawn_z")); // Spawn z
		this.writeBool(true); // Achievements Disabled
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.stoptime")); // Day Cycle Stop Time
		this.writeSignedVarInt(0); // Edu offser
		this.writeBool(false); // Edu features enabled
		this.writeString(""); // Edu product uuid
		this.writeFloatLE(0.0); // Rain level
		this.writeFloatLE(0.0); // Lightning level
		this.writeBool(false); // Has confirmed platform locked content
		this.writeBool(true); // Is multiplayer
		this.writeBool(true); // Broadcast to lan
		this.writeSignedVarInt(4); // Xbox live broadcast mode
		this.writeSignedVarInt(4); // Platform broadcast mode
		this.writeBool(this.server.bluebirdcfg.getNested("etc.enable_commands")); // Enable commands
		this.writeBool(this.server.bluebirdcfg.getNested("etc.texturepacksrequired")); // Are texture packs required
		this.writeVarInt(0); // Game rules count
		this.writeIntLE(0); // Experiments count
		this.writeBool(false); // Experiments previously used
		this.writeBool(false); // Bonus chest enabled
		this.writeBool(false); // Map enabled
		this.writeSignedVarInt(this.server.bluebirdcfg.getNested("etc.permission_level")); // Permission level
		this.writeIntLE(0); // Server chunk tick range
		this.writeBool(false); // Has locked behavior pack
		this.writeBool(false); // Has locked texture pack
		this.writeBool(false); // Is from locked world template
		this.writeBool(false); // Msa gamertags only
		this.writeBool(false); // Is from world template
		this.writeBool(false); // Is world template option locked
		this.writeBool(false); // Only spawn v1 villagers
		this.writeString(Identifiers.MINECRAFT_VERSION); // Game version
		this.writeIntLE(0); // Limited world width
		this.writeIntLE(0); // Limited world length
		this.writeBool(true); // Is new nether
		this.writeString(""); // Button name
		this.writeString(""); // Link uri
		this.writeBool(false); // Experimental gameplay override

		this.writeString(""); // Level id
		this.writeString(""); // World name
		this.writeString(""); // Premium world template id
		this.writeBool(false); // Is trial
		this.writeSignedVarInt(0); // Movement authority
		this.writeSignedVarInt(0); // Rewind history
		this.writeBool(false); // Server authoritative block breaking
		this.writeLongLE(0n); // Current tick

		this.writeSignedVarInt(0); // Enchantment seed

		this.writeVarInt(0); // Block properties count
		this.writeVarInt(0); // Item states count

		this.writeString(""); // Multiplayer correction id
		this.writeBool(this.server.bluebirdcfg.getNested("etc.server_auth_inventory")); // Server authoritative inventory
		this.writeString("BlueBird"); // Engine
		this.write(Buffer.from([0x0a, 0x00, 0x00])); // player properties
		this.writeLongLE(0n); // Block palette checksum
		this.writeUUID(new UUID()); // world template id
	}
}

module.exports = StartGamePacket;
