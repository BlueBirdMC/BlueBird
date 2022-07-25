const { TextFormat } = require("../../utils/TextFormat");
const Command = require("../Command");
const ConsoleCommandSender = require("../ConsoleCommandSender");

class FakeSayCommand extends Command {
    constructor() {
        super("fakesay", "Send a message using any username and any message content");
    }

    execute(sender, args) {
        if(args.length < 2){
            if(sender instanceof ConsoleCommandSender){
                sender.sendMessage(TextFormat.RED + "/fakesay <Username> <message>");
            }
            return;
        }
        sender.getServer().broadcastMessage(TextFormat.WHITE + `<${args[0]}> ` + args.slice(1).join(' '));
        console.log(`<${args[0]}> ${args.slice(1).join(' ')}`)
    }
}

module.exports = FakeSayCommand;
