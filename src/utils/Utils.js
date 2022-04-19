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

class Utils {
	static decodeJWT(token) {
		let [headB64, payloadB64, sigB64] = token.split(".");

		return JSON.parse(Utils.base64_decode(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), true));
	}

	/**
	 * @param {string} str 
	 * @param {Boolean} strict 
	 * @returns {string}
	 */
	static base64_decode(str, strict) {
		let characters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/", "=",];
		let valid_character = true;
		for (let i = 0; i < str.length; i++) {
			if (characters.indexOf(str[i]) === -1) valid_character = false;
		}
		if (strict === true) {
			if (valid_character === true) {
				return Buffer.from(str, "base64").toString("binary");
			} else {
				return false;
			}
		}
		return Buffer.from(str, "base64").toString("binary");
	}

	/**
	 * @param {string} str 
	 * @returns {string}
	 */
	static base64_encode(str) {
		return Buffer.from(str).toString("base64");
	}
}

module.exports = Utils;
