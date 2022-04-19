const HelpCommand = require("./default/HelpCommand");
const KickCommand = require("./default/KickCommand");
const SayCommand = require("./default/SayCommand");
const StopCommand = require("./default/StopCommand");
const TitleCommand = require("./default/TitleCommand");

class CommandRegisterer {
    constructor(server){
        let commandMap = server.getCommandMap();
        commandMap.register(StopCommand);
        commandMap.register(SayCommand);
        commandMap.register(TitleCommand);
        commandMap.register(HelpCommand);
        commandMap.register(KickCommand);
    }
}

module.exports = CommandRegisterer;