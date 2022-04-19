class CommandSender {
    server;

    constructor(server){
        this.server = server;
    }

    sendMessage(message){}

    getServer(){
        return this.server;
    }

    getName(){
        return "CommandSender";
    }
}

module.exports = CommandSender;