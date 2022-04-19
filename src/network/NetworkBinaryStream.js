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

const UUID = require("../utils/UUID");
const PersonaPieceTintColor = require("./mcpe/protocol/types/PersonaPieceTintColor");
const SkinData = require("./mcpe/protocol/types/SkinData");
const PersonaSkinPiece = require("./mcpe/protocol/types/PersonaSkinPiece");
const SkinAnimation = require("./mcpe/protocol/types/SkinAnimation");
const SkinImage = require("./mcpe/protocol/types/SkinImage");

class NetworkBinaryStream extends require("bbmc-binarystream") {
	/**
	 * @return {string}
	 */
	readString() {
		return this.read(this.readVarInt()).toString();
	}

	/**
	 * @param {stirng} v
	 */
	writeString(v) {
		this.writeVarInt(Buffer.byteLength(v));
		this.write(Buffer.from(v, "utf8"));
	}

	/**
	 * @return {Buffer}
	 */
	readByteArray() {
		return this.read(this.readVarInt());
	}

	/**
	 * @param {Buffer} v
	 */
	writeByteArray(v) {
		this.writeVarInt(v.length);
		this.write(v);
	}

	/**
	 * @return {UUID}
	 */
	readUUID() {
		let [p1, p0, p3, p2] = [
			this.readIntLE(),
			this.readIntLE(),
			this.readIntLE(),
			this.readIntLE(),
		];

		return new UUID(p0, p1, p2, p3);
	}

	/**
	 * @param {UUID} uuid
	 */
	writeUUID(uuid) {
		this.writeIntLE(uuid.getPart(1));
		this.writeIntLE(uuid.getPart(0));
		this.writeIntLE(uuid.getPart(3));
		this.writeIntLE(uuid.getPart(2));
	}

	/**
	 * @returns {SkinData}
	 */
	readSkin() {
		let skinId = this.readString();
		let skinPlayFabId = this.readString();
		let skinResourcePatch = this.readString();
		let skinData = this.readSkinImage();
		let animationCount = this.readIntLE();
		let animations = [];
		for(let i = 0; i < animationCount; ++i){
			let skinImage = this.readSkinImage();
			let animationType = this.readIntLE();
			let animationFrames = this.readFloatLE();
			let expressionType = this.readIntLE();
			animations.push(new SkinAnimation(skinImage, animationType, animationFrames, expressionType));
		}
		let capeData = this.readSkinImage();
		let geometryData = this.readString();
		let geometryDataVersion = this.readString();
		let animationData = this.readString();
		let capeId = this.readString();
		let fullSkinId = this.readString();
		let armSize = this.readString();
		let skinColor = this.readString();
		let personaPieceCount = this.readIntLE();
		let personaPieces = [];
		for(let i = 0; i < personaPieceCount; ++i){
			let pieceId = this.readString();
			let pieceType = this.readString();
			let packId = this.readString();
			let isDefaultPiece = this.readBool();
			let productId = this.readString();
			personaPieces.push(new PersonaSkinPiece(pieceId, pieceType, packId, isDefaultPiece, productId));
		}
		let pieceTintColorCount = this.readIntLE();
		let pieceTintColors = [];
		for(let i = 0; i < pieceTintColorCount; ++i){
			let pieceType = this.readString();
			let colorCount = this.readIntLE();
			let colors = [];
			for(let j = 0; j < colorCount; ++j){
				colors.push(this.readString());
			}
			pieceTintColors.push(new PersonaPieceTintColor(
				pieceType,
				colors
			));
		}
		let premium = this.readBool();
		let persona = this.readBool();
		let capeOnClassic = this.readBool();
		let isPrimaryUser = this.readBool();

		return new SkinData(skinId, skinPlayFabId, skinResourcePatch, skinData, animations, capeData, geometryData, geometryDataVersion, animationData, capeId, fullSkinId, armSize, skinColor, personaPieces, pieceTintColors, true, premium, persona, capeOnClassic, isPrimaryUser);
	}

	/**
	 * @param {SkinData} skin 
	 */
	writeSkin(skin){
		this.writeString(skin.getSkinId());
		this.writeString(skin.getPlayFabId());
		this.writeString(skin.getResourcePatch());
		this.writeSkinImage(skin.getSkinImage());
		this.writeIntLE(skin.getAnimations().length);
		skin.getAnimations().forEach(animation => {
			this.writeSkinImage(animation.getImage());
			this.writeIntLE(animation.getType());
			this.writeFloatLE(animation.getFrames());
			this.writeIntLE(animation.getExpressionType());
		});
		this.writeSkinImage(skin.getCapeImage());
		this.writeString(skin.getGeometryData());
		this.writeString(skin.getGeometryDataEngineVersion());
		this.writeString(skin.getAnimationData());
		this.writeString(skin.getCapeId());
		this.writeString(skin.getFullSkinId());
		this.writeString(skin.getArmSize());
		this.writeString(skin.getSkinColor());
		this.writeIntLE(skin.getPersonaPieces().length);
		skin.getPersonaPieces().forEach(piece => {
			this.writeString(piece.getPieceId());
			this.writeString(piece.getPieceType());
			this.writeString(piece.getPackId());
			this.writeBool(piece.isDefaultPiece());
			this.writeString(piece.getProductId());
		});
		this.writeIntLE(skin.getPieceTintColors().length);
		skin.getPieceTintColors().forEach(tint => {
			this.writeString(tint.getPieceType());
			this.writeIntLE(tint.getColors().length);
			tint.getColors().forEach(color => {
				this.writeString(color);
			});
		});
		skin.getPieceTintColors().forEach(tint => {
			this.writeString(tint.getPieceType());
			this.writeIntLE(tint.getColors().length);
			tint.getColors().forEach(color => {
				this.writeString(color);
			});
		});
		this.writeBool(skin.isPremium());
		this.writeBool(skin.isPersona());
		this.writeBool(skin.isPersonaCapeOnClassic());
		this.writeBool(skin.isPrimaryUser());
	}

	/**
	 * @returns {SkinImage}
	 */
	readSkinImage(){
		let width = this.readIntLE();
		let height = this.readIntLE();
		let data = this.readByteArray();
		return new SkinImage(height, width, data);
	}

	/**
	 * @param {SkinImage}
	 */
	writeSkinImage(image){
		this.writeIntLE(image.getWidth());
		this.writeIntLE(image.getHeight());
		this.writeByteArray(image.getData());
	}
}
module.exports = NetworkBinaryStream;
