const { TextFormat } = require("../../utils/TextFormat");
const Command = require("../Command");
const ConsoleCommandSender = require("../ConsoleCommandSender");

class SayRawCommand extends Command {
    constructor() {
        super("sayraw", "Broadcast a raw message to the players");
    }

    execute(sender, args) {
        if(args.length < 1){
            if(sender instanceof ConsoleCommandSender){
                sender.sendMessage(TextFormat.RED + "/sayraw <message>");
            }
            return;
        }
	sender.getServer().getLogger().info(args.join(" "));
        sender.getServer().broadcastMessage(args.join(" "));
    }
}

module.exports = SayRawCommand;
