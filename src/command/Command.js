class Command {
    name;
    description;

    constructor(name, description){
        this.name = name;
        this.description = description;
    }

    getName(){
        return this.name;
    }

    getDescription(){
        return this.description;
    }

    execute(sender, args){}
}

module.exports = Command;