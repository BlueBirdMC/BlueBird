const Command = require("../Command");

class StopCommand extends Command {
    constructor(){
        super("stop", "stop the server");
    }

    execute(sender, args){
        sender.getServer().getLogger().info("Server stopped!");
        sender.getServer().shutdown();
    }
}

module.exports = StopCommand;
