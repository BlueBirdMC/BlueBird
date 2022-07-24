/*********
 * @author andriycraft
 * (c) andriycraft 2022 - 2069
 * do not steal my code!
 */

const DataPacket = require("./DataPacket");
const Identifiers = require("./Identifiers");

class AvailableCommandsPacket extends DataPacket {
    static NETWORK_ID = Identifiers.AVAILABLE_COMMANDS_PACKET;


    decodePayload() { }

    encodePayload() { }
}

module.exports = AvailableCommandsPacket;