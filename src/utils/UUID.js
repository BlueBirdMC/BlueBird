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

const BinaryStream = require("bbmc-binarystream");
const crypto = require("crypto");

class UUID {

	/** @type {number[]} */
	parts;
	/** @type {number} */
	version;

	constructor(part1 = 0, part2 = 0, part3 = 0, part4 = 0, version = null) {
		this.parts = [part1, part2, part3, part4];

		this.version = version || (this.parts[1] & 0xf000) >> 12;
	}

	/**
	 * @returns {number}
	 */
	getVersion() {
		return this.version;
	}

	/**
	 * @param {UUID} uuid 
	 * @returns {Boolean}
	 */
	equals(uuid) {
		return uuid.parts === this.parts;
	}

	/**
	 * @param {string} uuid 
	 * @param {number} version 
	 * @returns {UUID}
	 */
	static fromString(uuid, version = null) {
		return UUID.fromBinary(Buffer.from(uuid.trim().replace(/-/g, ""), "hex"), version);
	}

	/**
	 * @param {string} uuid 
	 * @param {number} version 
	 * @returns {UUID}
	 */
	static fromBinary(uuid, version) {
		if (uuid.length !== 16) {
			throw new TypeError("UUID buffer must be exactly 16 bytes");
		}
		let stream = new BinaryStream(Buffer.from(uuid));
		return new UUID(stream.readIntBE(), stream.readIntBE(), stream.readIntBE(), stream.readIntBE(), version);
	}

	/**
	 * @returns {string}
	 */
	static fromRandom() {
		return crypto.randomUUID();
	}

	/**
	 * @returns {number}
	 */
	toBinary() {
		let stream = new BinaryStream();
		stream.writeIntBE(this.parts[0] + this.parts[1] + this.parts[2] + this.parts[3]);
		return stream.readIntBE();
	}

	/**
	 * @returns {string}
	 */
	toString() {
		let hex = this.toBinary().toString(16);
		return `${hex.substring(0, 8)}-${hex.substring(8, 4)}-${hex.substring(12, 4)}-${hex.substring(16, 4)}-${hex.substring(20, 12)}`;
	}

	/**
	 * @param {number} partNumber 
	 * @returns {string}
	 */
	getPart(partNumber) {
		if (partNumber < 0 || partNumber > 3) {
			throw new Error(`Invalid UUID part index ${partNumber}`);
		}
		return this.parts[partNumber];
	}

	/**
	 * @returns {number[]}
	 */
	getParts() {
		return this.parts;
	}
}

module.exports = UUID;
