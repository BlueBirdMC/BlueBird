const TextFormat = require("../../utils/TextFormat");
const Command = require("../Command");

class KickCommand extends Command {
	constructor(){
		super("kick", "kick someone");
	}

	execute(sender, args){
		let server = sender.getServer();
        if(args.length < 2){
            server.getLogger().info(TextFormat.RED + "/kick <playerName> <reason>");
            return;
        }
		let player = server.getPlayerByPrefix(args[0]);
        if((player === undefined) || (player !== undefined && !player.isConnected())){
			server.getLogger().info(TextFormat.RED + "unknown player");
			return;
        }
		player.kick(args.slice(1).join(" "), sender.getName());
	}
}

module.exports = KickCommand;