const Command = require("../Command");

class StopCommand extends Command {
    constructor(){
        super("stop", "stop the server");
    }

    execute(sender, args){
        sender.getServer().getLogger().alert("Server stopped!");
        sender.getServer().shutdown();
    }
}

module.exports = StopCommand;