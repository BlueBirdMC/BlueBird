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

const SkinData = require("./SkinData");
const SkinImage = require("./SkinImage");
const Skin = require("../../../../entity/Skin");
const crypto = require('crypto');

class LegacySkinAdapter {

	toSkinData(skin) {
		let capeData = skin.getCapeData();
		let capeImage = capeData === "" ? new SkinImage(0, 0, "") : new SkinImage(32, 64, capeData);
		let geometryName = skin.getGeometryName();
		if (geometryName === "") {
			geometryName = "geometry.humanoid.custom";
		}
		return new SkinData(
			skin.getSkinId(),
			"", //playfabid
			JSON.stringify({ "geometry": { "default": geometryName } }),
			SkinImage.fromLegacy(skin.getSkinData()),
			[],
			capeImage,
			skin.getGeometryData()
		);
	}

	fromSkinData(data) {
		if (data.isPersona()) {
			return new Skin('Standard_Custom', crypto.randomBytes(3).toString('hex') + "\xff".repeat(4096));
		}

		let capeData = data.isPersonaCapeOnClassic() ? "" : data.getCapeImage().getData();

		let geometryName = "";
		let resourcePatch = JSON.parse(data.getResourcePatch());

		if (resourcePatch.constructor === Object && typeof resourcePatch['geometry']['default'] !== 'undefined' && typeof resourcePatch['geometry']['default'] === 'string') {
			geometryName = resourcePatch['geometry']['default'];
		} else {
			throw new Error("Invalid skin/resourcepatch is not the type object, maybe undefined?");
		}

		return new Skin(data.getSkinId(), data.getSkinImage().getData(), capeData, geometryName, data.getGeometryData());
	}
}

module.exports = LegacySkinAdapter;
