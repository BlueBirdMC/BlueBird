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

 const fs = require("fs");

class Config {
	static TYPE_JSON = 0;

	file;
	type;
	content;

	constructor(file, type, content = {}) {
		this.#load(file, type, content);
	}

	#load(file, type, content) {
		this.file = file;
		this.type = type;
		let nc;
		if (!fs.existsSync(file)) {
			this.content = content;
			this.save();
		} else {
			nc = fs.readFileSync(file).toString();
			switch(type){
				case Config.TYPE_JSON:
					nc = eval(`(${nc})`);
					break;
				default:
					break;
			}
		}
		this.content = Object.assign({}, content, nc);
	}

	set(l, v) {
		this.content[l] = v;
	}

	get(l) {
		return typeof this.content[l] !== "undefined" ? this.content[l] : false;
	}

	setNested(l, v) {
		let vars = l.split(".");
		let base = vars.shift();
		if (typeof this.content[base] === "undefined") {
			this.content[base] = {};
		}
		base = this.content[base];
		while (vars.length > 0) {
			let basel = vars.shift();
			if (typeof this.content[basel] === "undefined") {
				base[basel] = {};
			}
			if (vars.length > 0) {
				base = base[basel];
			} else {
				base[basel] = v;
			}
		}
	}

	getNested(l) {
		let vars = l.split(".");
		let base = vars.shift();
		if (typeof this.content[base] !== "undefined") {
			base = this.content[base];
		} else {
			return false;
		}
		while (vars.length > 0) {
			let basel = vars.shift();
			if (base instanceof Object && typeof base[basel]) {
				base = base[basel];
			} else {
				return false;
			}
		}

		return base;
	}

	getAll(l = false) {
		return l ? Object.keys(this.content) : this.content;
	}

	setAll(content) {
		this.content = content;
	}

	remove(l) {
		delete this.content[l];
	}

	exists(l) {
		return this.get(l) !== false;
	}

	save() {
		let content;
		switch(this.type){
			case Config.TYPE_JSON:
				content = JSON.stringify(this.content, null, 4);
				break;
			default:
				break;
		}
		fs.writeFileSync(this.file, content);
	}
}

module.exports = Config;