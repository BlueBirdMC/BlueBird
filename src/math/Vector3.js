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

class Vector3 {
    x;
    y;
    z;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * @returns {Vector3}
     */
    static zero(){
        return new Vector3(0, 0, 0);
    }

    /**
     * @returns {number}
     */
    getX(){
        return this.x;
    }

    /**
     * @returns {number}
     */
    getY(){
        return this.y;
    }

    /**
     * @returns {number}
     */
    getZ(){
        return this.z;
    }

    /**
     * @returns {number}
     */
    getFloorX(){
        return Math.floor(this.x);
    }

    /**
     * @returns {number}
     */
    getFloorY(){
        return Math.floor(this.y);
    }

    /**
     * @returns {number}
     */
    getFloorZ(){
        return Math.floor(this.z);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Vector3}
     */
    add(x, y, z){
        return new Vector3(this.x + x, this.y + y, this.z + z);
    }

    /**
     * @param {Vector3} vector3 
     * @returns {Vector3}
     */
    addVector(vector3){
        return this.add(vector3.x, vector3.y, vector3.z);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     * @returns {Vector3}
     */
    subtract(x, y, z){
        return this.add(-x, -y, -z);
    }

    /**
     * @param {Vector3} vector3 
     * @returns {Vector3}
     */
    subtractVector(vector3){
        return this.add(vector3.x, vector3.y, vector3.z);
    }

    /**
     * 
     * @param {number} number 
     * @returns {Vector3}
     */
    multiply(number){
        return new Vector3(this.x * number, this.y * number, this.z * number);
    }

    /**
     * 
     * @param {number} number 
     * @returns {Vector3}
     */
    divide(number){
        return new Vector3(this.x / number, this.y / number, this.z / number);
    }

    /**
     * @returns {Vector3}
     */
    ceil(){
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }

    /**
     * @returns {Vector3}
     */
    floor(){
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }

    /**
     * @param {Vector3} pos 
     * @returns {number}
     */
    distance(pos){
        return Math.sqrt(this.distanceSquared(pos));
    }

    /**
     * @param {Vector3} pos 
     * @returns {number}
     */
    distanceSquared(pos){
        return ((this.x - pos.x) ** 2) + ((this.y - pos.y) ** 2) + ((this.z - pos.z) ** 2);
    }
}

module.exports = Vector3;
