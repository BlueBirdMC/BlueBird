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

class Skin {
    static ACCEPTED_SKIN_SIZES = [
        64 * 32 * 4,
        64 * 64 * 4,
        128 * 128 * 4
    ];

    #skinId;
    #skinData;
    #capeData;
    #geometryName;
    #geometryData;

    constructor(skinId, skinData, capeData = "", geometryName = "", geometryData = "") {
        this.#skinId = skinId;
        this.#skinData = skinData;
        this.#capeData = capeData;
        this.#geometryName = geometryName;
        this.#geometryData = geometryData;
    }

    isValid(){
        try {
            this.validate();
            return true;
        } catch (e) {
            return false;
        }
    }

    static checkLength(thing, name, maxLength) {
        if(thing.length > maxLength) {
            throw new Error(`${name} must be at most ${maxLength} but have ${thing.length}`);
        }
    }

    validate() {
        Skin.checkLength(this.#skinId, "Skin ID", 0x7fff);
        Skin.checkLength(this.#geometryName, "Geometry name", 0x7fff);
        Skin.checkLength(this.#geometryData, "Geometry data", Number.MAX_SAFE_INTEGER);

        if(!this.#skinId) {
            throw new Error("Skin id must not be empty");
        }

        let length = this.#skinData.length;
        if(Skin.ACCEPTED_SKIN_SIZES.includes(length) === false) {
            throw new Error(`Invalid skin data size ${length} bytes (allowed sizes: ${Skin.ACCEPTED_SKIN_SIZES.join(', ')})`);
        }

        if(this.#capeData !== "" && this.#capeData.length !== 8192) {
            throw new Error("Invalid cape data size " + this.#capeData.length + " bytes (must be exactly 8192 bytes)");
        }

        if(this.#geometryData !== ""){
            let decodedGeometry = JSON.stringify(this.#geometryData);
            // console.log(decodedGeometry);
            if(decodedGeometry === false){
                throw new Error("Invalid geometry data");
            }

            this.#geometryData = JSON.parse(decodedGeometry);
        }
    }

    /** @return {String} */
    getSkinId() {
        return this.#skinId;
    }

    /** @return {String} */
    getSkinData() {
        return this.#skinData;
    }

    /** @return {String} */
    getCapeData() {
        return this.#capeData;
    }

    /** @return {String} */
    getGeometryName() {
        return this.#geometryName;
    }

    /** @return {String} */
    getGeometryData() {
        return this.#geometryData;
    }
}

module.exports = Skin;
