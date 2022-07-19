const Command = require("../Command");

class StopCommand extends Command {
    constructor(){
        super("stop", "Stop the server");
    }

    execute(sender, args){
        sender.getServer().getLogger().info("Server stopped!");
        sender.getServer().shutdown();
	process.exit(0);
    }
}

module.exports = StopCommand;
