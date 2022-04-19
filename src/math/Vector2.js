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

class Vector2 {
    x;
    y;

    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    static zero(){
        return new Vector2(0, 0);
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
     * @param {number} x 
     * @param {number} y 
     * @returns {Vector2}
     */
    add(x, y){
        return new Vector2(this.x + x, this.y + y);
    }

    /**
     * @param {Vector2} vector2 
     * @returns {Vector2}
     */
    addVector(vector2){
        return this.add(vector2.x, vector2.y);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     * @returns {Vector2}
     */
    subtract(x, y){
        return this.add(-x, -y);
    }

    /**
     * @param {number} vector2 
     * @returns {Vector2}
     */
    subtractVector(vector2){
        return this.add(-vector2.x, -vector2.y);
    }

    /**
     * @param {number} number 
     * @returns {Vector2}
     */
    multiply(number){
        return new Vector2(this.x * number, this.y * number);
    }

    /**
     * @param {number} number 
     * @returns {Vector2}
     */
    divide(number){
        return new Vector2(this.x / number, this.y / number);
    }

    /**
     * @returns {Vector2}
     */
    ceil(){
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * @returns {Vector2}
     */
    floor(){
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * @param {Vector2} pos 
     * @returns {number}
     */
    distance(pos){
        return Math.sqrt(this.distanceSquared(pos));
    }

    /**
     * @param {Vector2} pos 
     * @returns {number}
     */
    distanceSquared(pos){
        return ((this.x - pos.x) ** 2) + ((this.y - pos.y));
    }
}

module.exports = Vector2;
