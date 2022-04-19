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

const Vector3 = require("../math/Vector3");

class Entity extends Vector3 {

    static entityCount = 1;
    id;

    constructor() {
        super(0, 4, 0);
        this.id = Entity.nextRuntimeId();
    }
    
    static nextRuntimeId(){
        return Entity.entityCount++;
    }
}

module.exports = Entity;