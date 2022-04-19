const TextFormat = require("../../utils/TextFormat");
const Command = require("../Command");

class HelpCommand extends Command {
    constructor(){
        super("help", "get the help list");
    }

    execute(sender, args){
        let list = [];
        for(let commands of sender.getServer().getCommandMap().getCommands()){
            list.push(commands.getName() + "> " + commands.getDescription());
        }
        sender.sendMessage(TextFormat.GREEN + "-".repeat(list.length) + " Help List " + "-".repeat(list.length));
        list.forEach(nameAndDesc => {
            nameAndDesc = nameAndDesc.split("> ");
            sender.sendMessage(`${TextFormat.YELLOW}/${nameAndDesc[0]} : ${nameAndDesc[1]}`);
        });
    }
}

module.exports = HelpCommand;