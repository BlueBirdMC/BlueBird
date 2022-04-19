const CommandSender = require("./CommandSender");

class ConsoleCommandSender extends CommandSender {
    sendMessage(message){
        this.getServer().getLogger().info(message);
    }

    getName(){
        return "Console";
    }
}

module.exports = ConsoleCommandSender;