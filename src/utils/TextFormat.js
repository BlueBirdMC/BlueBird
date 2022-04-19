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

class TextFormat {
	static ESCAPE = "\u00A7";
	static BLACK = TextFormat.ESCAPE + "0";
	static DARK_BLUE = TextFormat.ESCAPE + "1";
	static DARK_GREEN = TextFormat.ESCAPE + "2";
	static DARK_AQUA = TextFormat.ESCAPE + "3";
	static DARK_RED = TextFormat.ESCAPE + "4";
	static DARK_PURPLE = TextFormat.ESCAPE + "5";
	static GOLD = TextFormat.ESCAPE + "6";
	static GRAY = TextFormat.ESCAPE + "7";
	static DARK_GRAY = TextFormat.ESCAPE + "8";
	static BLUE = TextFormat.ESCAPE + "9";
	static GREEN = TextFormat.ESCAPE + "a";
	static AQUA = TextFormat.ESCAPE + "b";
	static RED = TextFormat.ESCAPE + "c";
	static LIGHT_PURPLE = TextFormat.ESCAPE + "d";
	static YELLOW = TextFormat.ESCAPE + "e";
	static WHITE = TextFormat.ESCAPE + "f";
	static OBFUSCATED = TextFormat.ESCAPE + "k";
	static BOLD = TextFormat.ESCAPE + "l";
	static STRIKETHROUGH = TextFormat.ESCAPE + "m";
	static UNDERLINE = TextFormat.ESCAPE + "n";
	static ITALIC = TextFormat.ESCAPE + "o";
	static RESET = TextFormat.ESCAPE + "r";

	/**
	 * @param {string} str 
	 * @returns {string}
	 */
	static tokenize(str) {
		return str.toString().split(new RegExp("(" + TextFormat.ESCAPE + "[0123456789abcdefklmnor])")).filter((v) => v !== "");
	}

	/**
	 * @param {string} str 
	 * @param {Boolean} removeFormat 
	 * @returns {string}
	 */
	static clean(str, removeFormat = true) {
		if (removeFormat) {
			return str.replace(new RegExp(TextFormat.ESCAPE + "[0123456789abcdefklmnor]", "g"), "").replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, "").replace(new RegExp(TextFormat.ESCAPE, "g"), "");
		}
		return str.replace(/\x1b[\\(\\][[0-9;\\[\\(]+[Bm]/g, "").replace(/\x1b/g, "");
	}

	/**
	 * @param {string} str 
	 * @returns {string}
	 */
	static toTerminal(str) {
		str = TextFormat.tokenize(str);
		str.forEach((v, k) => {
			switch (v) {
				case TextFormat.BLACK:
					str[k] = TerminalColors.BLACK;
					break;
				case TextFormat.DARK_BLUE:
					str[k] = TerminalColors.DARK_BLUE;
					break;
				case TextFormat.DARK_GREEN:
					str[k] = TerminalColors.DARK_GREEN;
					break;
				case TextFormat.DARK_AQUA:
					str[k] = TerminalColors.DARK_AQUA;
					break;
				case TextFormat.DARK_RED:
					str[k] = TerminalColors.DARK_RED;
					break;
				case TextFormat.DARK_PURPLE:
					str[k] = TerminalColors.DARK_PURPLE;
					break;
				case TextFormat.GOLD:
					str[k] = TerminalColors.GOLD;
					break;
				case TextFormat.GRAY:
					str[k] = TerminalColors.GRAY;
					break;
				case TextFormat.DARK_GRAY:
					str[k] = TerminalColors.DARK_GRAY;
					break;
				case TextFormat.BLUE:
					str[k] = TerminalColors.BLUE;
					break;
				case TextFormat.GREEN:
					str[k] = TerminalColors.GREEN;
					break;
				case TextFormat.AQUA:
					str[k] = TerminalColors.AQUA;
					break;
				case TextFormat.RED:
					str[k] = TerminalColors.RED;
					break;
				case TextFormat.LIGHT_PURPLE:
					str[k] = TerminalColors.LIGHT_PURPLE;
					break;
				case TextFormat.YELLOW:
					str[k] = TerminalColors.YELLOW;
					break;
				case TextFormat.WHITE:
					str[k] = TerminalColors.WHITE;
					break;
				case TextFormat.BOLD:
					str[k] = TerminalColors.BOLD;
					break;
				case TextFormat.OBFUSCATED:
					str[k] = TerminalColors.OBFUSCATED;
					break;
				case TextFormat.ITALIC:
					str[k] = TerminalColors.ITALIC;
					break;
				case TextFormat.UNDERLINE:
					str[k] = TerminalColors.UNDERLINE;
					break;
				case TextFormat.STRIKETHROUGH:
					str[k] = TerminalColors.STRIKETHROUGH;
					break;
				case TextFormat.RESET:
					str[k] = TerminalColors.RESET;
					break;
			}
		});
	
		return str.join("");
	}
}

class TerminalColors {
	static ESCAPE = "\u001b";
	static BLACK = TerminalColors.ESCAPE + "[30m";
	static DARK_BLUE = TerminalColors.ESCAPE + "[34m";
	static DARK_GREEN = TerminalColors.ESCAPE + "[32m";
	static DARK_AQUA = TerminalColors.ESCAPE + "[36m";
	static DARK_RED = TerminalColors.ESCAPE + "[31m";
	static DARK_PURPLE = TerminalColors.ESCAPE + "[35m";
	static GOLD = TerminalColors.ESCAPE + "[33m";
	static GRAY = TerminalColors.ESCAPE + "[37m";
	static DARK_GRAY = TerminalColors.ESCAPE + "[30;1m";
	static BLUE = TerminalColors.ESCAPE + "[34;1m";
	static GREEN = TerminalColors.ESCAPE + "[32;1m";
	static AQUA = TerminalColors.ESCAPE + "[36;1m";
	static RED = TerminalColors.ESCAPE + "[31;1m";
	static LIGHT_PURPLE = TerminalColors.ESCAPE + "[35;1m";
	static YELLOW = TerminalColors.ESCAPE + "[33;1m";
	static WHITE = TerminalColors.ESCAPE + "[37;1m";
	static OBFUSCATED = TerminalColors.ESCAPE + "[47m";
	static BOLD = TerminalColors.ESCAPE + "[1m";
	static STRIKETHROUGH = TerminalColors.ESCAPE + "[9m";
	static UNDERLINE = TerminalColors.ESCAPE + "[4m";
	static ITALIC = TerminalColors.ESCAPE + "[3m";
	static RESET = TerminalColors.ESCAPE + "[0m";
}

module.exports = TextFormat;
