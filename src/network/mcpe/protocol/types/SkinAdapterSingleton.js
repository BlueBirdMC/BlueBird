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

const LegacySkinAdapter = require("./LegacySkinAdapter");

class SkinAdapterSingleton {
	static #instance = null;

	/**
	 * @returns {LegacySkinAdapter}
	 */
	static get() {
		if (this.#instance === null) {
			this.#instance = new LegacySkinAdapter();
		}
		return this.#instance;
	}

	/**
	 * @param {LegacySkinAdapter} adapter
	 */
	static set(adapter) {
		this.#instance = adapter;
	}
}

module.exports = SkinAdapterSingleton;