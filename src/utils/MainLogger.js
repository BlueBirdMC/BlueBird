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

const TextFormat = require("./TextFormat");

class MainLogger {
	/** @type {number} */
	#debuggingLevel = 0;

	/**
	 * @param {string} message 
	 * @returns {Boolean}
	 */
	alert(message) {
		return this.log("ALERT", message, TextFormat.AQUA);
	}

	/**
	 * @param {string} message
	 * @returns {Boolean}
	 */
	emergency(message) {
		return this.log("EMERGENCY", message, TextFormat.RED);
	}

	/**
	 * @param {string} message
	 * @param {Boolean}
	 */
	critical(message) {
		return this.log("CRITICAL", message, TextFormat.RED);
	}

	/**
	 * @param {string} message
	 * @param {Boolean}
	 */
	error(message) {
		return this.log("ERROR", message, TextFormat.DARK_RED);
	}

	/**
	 * @param {string} message
	 * @param {Boolean}
	 */
	warning(message) {
		return this.log("WARNING", message, TextFormat.YELLOW);
	}

	/**
	 * @param {string} message
	 * @param {Boolean}
	 */
	info(message) {
		return this.log("INFO", message, TextFormat.WHITE);
	}

	/**
	 * @param {string} message
	 * @param {Boolean}
	 */
	notice(message) {
		return this.log("NOTICE", message, TextFormat.BLUE);
	}

	/**
	 * @param {string} message
	 * @param {Boolean}
	 */
	debug(message) {
		if (this.#debuggingLevel < 1) return false;
		return this.log("DEBUG", message, TextFormat.GRAY);
	}

	/**
	 * @param {string} message
	 * @param {Boolean}
	 */
	debugExtensive(message) {
		if (this.#debuggingLevel < 2) return false;
		return this.log("DEBUG", message, TextFormat.GRAY);
	}

	/**
	 * @param {string} type 
	 * @param {string} message 
	 * @param {string} color 
	 */
	log(type, message, color = TextFormat.GRAY) {
		color = TextFormat.toTerminal(color);
		message = TextFormat.toTerminal(message);
		let date = new Date();
		let timeString = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
		console.log(`${TextFormat.toTerminal(TextFormat.BLUE)}[${timeString}]${TextFormat.toTerminal(TextFormat.RESET)}${color} ${type} >`, message + TextFormat.toTerminal(TextFormat.RESET));
		return true;
	}

	/**
	 * @param {number} level 
	 */
	setDebuggingLevel(level) {
		this.#debuggingLevel = level;
	}

	/**
	 * @returns {number}
	 */
	getDebuggingLevel() {
		return this.#debuggingLevel;
	}
}

module.exports = MainLogger;
