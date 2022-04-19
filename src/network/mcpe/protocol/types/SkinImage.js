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

class SkinImage {

	height;
	width;
	data;

	constructor(height, width, data) {
		if (height < 0 || width < 0) {
			throw new Error("Unknown height and width");
		}
		let expected = height * width * 4;
		let actual = data.length;
		if (expected !== actual) {
			throw new Error(`Data should be ${expected} got ${actual}`);
		}
		this.height = height;
		this.width = width;
		this.data = data;
	}

	static fromLegacy(data) {
		switch (data.length) {
			case 64 * 32 * 4:
				return new SkinImage(32, 64, data);
			case 64 * 64 * 4:
				return new SkinImage(64, 64, data);
			case 128 * 128 * 4:
				return new SkinImage(128, 128, data);
		}
		throw new Error("Unknown size");
	}

	getHeight() {
		return this.height;
	}

	getWidth() {
		return this.width;
	}

	getData() {
		return this.data;
	}
}

module.exports = SkinImage;
