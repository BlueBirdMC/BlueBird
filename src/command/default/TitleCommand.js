const SetTitlePacket = require("../../network/mcpe/protocol/SetTitlePacket");
const TextFormat = require("../../utils/TextFormat");
const Command = require("../Command");

class TitleCommand extends Command {
    constructor(){
        super("title", "send a title to a player");
    }

    execute(sender, args){
        let server = sender.getServer();
        if(args.length < 3){
            server.getLogger().info(TextFormat.RED + "/title <type> <playerName> <message>");
            return;
        }
        let type;
        switch(args[0]){
            case "title":
                type = SetTitlePacket.TYPE_SET_TITLE;
                break;
            case "subtitle":
                type = SetTitlePacket.TYPE_SET_SUBTITLE;
                break;
            case "popup":
            case "actionbar":
                type = SetTitlePacket.TYPE_SET_ACTIONBAR_MESSAGE;
                break;
            case "clear":
                type = SetTitlePacket.TYPE_CLEAR_TITLE;
                break;
            case "reset":
                type = SetTitlePacket.TYPE_RESET_TITLE;
                break;
            default:
                type = SetTitlePacket.TYPE_CLEAR_TITLE;
                break;
        }
        let player = server.getPlayerByPrefix(args[1]);
        if(player !== null && player.isConnected()){
            player.sendTitleText(args.slice(2).join(" "), type);
        }
    }
}

module.exports = TitleCommand;