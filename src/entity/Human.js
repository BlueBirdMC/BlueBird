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

const PlayerSkinPacket = require("../network/mcpe/protocol/PlayerSkinPacket");
const Entity = require("./Entity");
const SkinAdapterSingleton = require("../network/mcpe/protocol/types/SkinAdapterSingleton");

class Human extends Entity {
    server;
    uuid;
    skin;

    constructor(server, uuid){
        super();
        this.server = server;
        this.uuid = uuid;
    }

   /**
    * @param {Skin} skin 
    */
    setSkin(skin) {
        skin.validate();
        this.skin = skin;
    }
    
    /**
     * @param {Player[]} targets_1 
     */
     sendSkin(targets_1 = null) {
        let pk = new PlayerSkinPacket();
        pk.uuid = this.uuid;
        pk.skin = SkinAdapterSingleton.get().toSkinData(this.skin);
        this.server.broadcastPacket(targets_1 ? targets_1 : this.server.getOnlinePlayers(), pk);
     }
}

module.exports = Human;
