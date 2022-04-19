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

class StartGamePacket extends DataPacket {
	static NETWORK_ID = Identifiers.START_GAME_PACKET;

	canBeSentBeforeLogin = true;

	entityId;
	entityRuntimeId;

	encodePayload() {
		this.writeSignedVarLong(this.entityId); // Entity id
		this.writeVarLong(this.entityRuntimeId); // Runtime entity id
		this.writeSignedVarInt(1); // Player gamemode

		this.writeFloatLE(0.0); // Player x
		this.writeFloatLE(4.0); // Player y
		this.writeFloatLE(0.0); // PLayer z

		this.writeFloatLE(0.0); // Pitch
		this.writeFloatLE(0.0); // Yaw

		this.writeSignedVarInt(0); // Seed
		this.writeShortLE(0); // Biome type
		this.writeString(""); // Biome name
		this.writeSignedVarInt(0); // Dimension
		this.writeSignedVarInt(1); // Generator
		this.writeSignedVarInt(1); // World gamemode
		this.writeSignedVarInt(0); // Difficulty
		this.writeSignedVarInt(0); // Spawn x
		this.writeVarInt(4); // Spawn y
		this.writeSignedVarInt(0); // Spawn z
		this.writeBool(true); // Achievements Disabled
		this.writeSignedVarInt(0); // Day Cycle Stop Time
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
		this.writeBool(true); // Enable commands
		this.writeBool(false); // Are texture packs required
		this.writeVarInt(0); // Game rules count
		this.writeIntLE(0); // Experiments count
		this.writeBool(false); // Experiments previously used
		this.writeBool(false); // Bonus chest enabled
		this.writeBool(false); // Map enabled
		this.writeSignedVarInt(1); // Permission level
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
		this.writeLongLE(BigInt(0)); // Current tick

		this.writeSignedVarInt(0); // Enchantment seed

		this.writeVarInt(0); // Block properties count
		this.writeVarInt(0); // Item states count

		this.writeString(""); // Multiplayer correction id
		this.writeBool(false); // Server authoritative inventory
		this.writeString("BlueBird"); // Engine
		this.writeLongLE(BigInt(0)); // Block palette checksum
	}
}

module.exports = StartGamePacket;
