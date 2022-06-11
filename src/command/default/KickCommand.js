const { TextFormat } = require("../../utils/TextFormat");
const Command = require("../Command");

class KickCommand extends Command {
	constructor() {
		super("kick", "kick someone");
	}

	execute(sender, args) {
		let server = sender.getServer();
                 if(args.length < 1){
                   server.getLogger().info(TextFormat.RED + "/kick <player name> <reason>");
                   return;
                }
		let player = server.getPlayerByPrefix(args[0]);
                if((player === undefined) || (player !== undefined && !player.isConnected())){
		    server.getLogger().info(TextFormat.RED + "Player not found!");
		    return;
                }
		let reason = args.slice(1).join(" ");
		if (!reason) reason = "No reason"
		player.kick(reason, sender.getName());
	}
}

module.exports = KickCommand;
