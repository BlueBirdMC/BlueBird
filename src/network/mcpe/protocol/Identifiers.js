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

class Identifiers {
	static CURRENT_PROTOCOL = 527;
	static MINECRAFT_VERSION = "1.19.0";
	static GAME_PACKET = 0xfe;
	static LOGIN_PACKET = 0x01;
	static PLAY_STATUS_PACKET = 0x02;
	static DISCONNECT_PACKET = 0x05;
	static RESOURCE_PACKS_INFO_PACKET = 0x06;
	static RESOURCE_PACK_STACK_PACKET = 0x07;
	static RESOURCE_PACK_CLIENT_RESPONSE_PACKET = 0x08;
	static TEXT_PACKET = 0x09;
	static START_GAME_PACKET = 0x0b;
	static BIOME_DEFINITION_LIST_PACKET = 0x7a;
	static CREATIVE_CONTENT_PACKET = 0x91;
	static SET_TITLE_PACKET = 0x58;
	static PLAYER_SKIN_PACKET = 0x5d;
	static SET_LOCAL_PLAYER_AS_INITIALIZED_PACKET = 0x71;
	static AVAILABLE_ACTOR_IDENTIFIERS_PACKET = 0x77;
	static AVAILABLE_COMMANDS_PACKET = 0x4d;
	static TOAST_REQUEST_PACKET = 0xba;
	static MODAL_FORM_REQUEST_PACKET = 0x64;
	static MODAL_FORM_RESPONSE_PACKET = 0x65;
	static TRANSFER_PACKET = 0x55;
	static TICK_SYNC_PACKET = 0x17;
	static REQUEST_CHUNK_RADIUS_PACKET = 0x45;
	static CLIENT_CACHE_STATUS_PACKET = 0x81;
	static SET_TIME_PACKET = 0x0A;
}

module.exports = Identifiers;
