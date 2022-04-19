const TextFormat = require("../../utils/TextFormat");
const Command = require("../Command");
const ConsoleCommandSender = require("../ConsoleCommandSender");

class SayCommand extends Command {
    constructor(){
        super("say", "broadcast a message to the players");
    }

    execute(sender, args){
        if(args.length < 1){
            if(sender instanceof ConsoleCommandSender){
                sender.sendMessage(TextFormat.RED + "/say <message>");
            }
            return;
        }
        sender.getServer().broadcastMessage(TextFormat.RED + "[CONSOLE] " + TextFormat.WHITE + args.join(" "));
    }
}

module.exports = SayCommand;