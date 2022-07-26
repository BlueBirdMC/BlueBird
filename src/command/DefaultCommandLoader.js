const HelpCommand = require("./default/HelpCommand");
const KickCommand = require("./default/KickCommand");
const SayCommand = require("./default/SayCommand");
const StopCommand = require("./default/StopCommand");
const TitleCommand = require("./default/TitleCommand");
const FakeSayCommand = require("./default/FakeMessageCommand.js");

class DefaultCommandLoader {
    static init(server){
        server.getCommandMap().registerArray([
            new StopCommand(),
            new SayCommand(),
            new TitleCommand(),
            new HelpCommand(),
            new KickCommand(),
            new FakeSayCommand()
        ]);
    }
}

module.exports = DefaultCommandLoader;