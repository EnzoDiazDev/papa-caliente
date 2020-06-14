const {Client, MessageEmbed} = require("discord.js")
const Game = require("./game/Game")

const bot = new Client()
const game = new Game()

bot.on("ready", () => {
    console.log("Im so hot!")
    game.setGuildsAndUsers(bot.guilds.cache)
})

bot.on("guildCreate", guild => {
    let online_user_ids = Game.fromGuildGetOnlineUserIds(guild)
    let a_user = online_user_ids[Math.floor(Math.random() * online_user_ids.length)]
    game.guilds.set(guild.id, {
        online_user_ids,
        is_vulgar: false,
        has_the_papa: a_user,
        papa_is_hidden: false
    })
})

bot.on("guildDelete", guild => {
    game.guilds.delete(guild.id)
})

setInterval(() => {
    game.refreshGuildsAndUsers(bot.guilds.cache)
}, 3600000)

const prefix = "."

bot.on("message", async message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return
    let message_without_prefix = message.content.split(" ")[0] === prefix ?
            message.content.split(" ").slice(1).join(" ").toLowerCase().trim() :
            message.content.slice(prefix.length).toLowerCase().trim()
    let command = message_without_prefix.split(" ")[0].trim()
    let parameters = message_without_prefix.split(" ").slice(1).map(parameter => parameter.trim()).filter(parameter => parameter !== "")
    
    if(command === "vulgarity"){
        if(message.member.hasPermission("ADMINISTRATOR")){
            let value = parameters[0]
            
            if(value === "true"){
                if(!game.guildIsVulgar(message.guild.id)){
                    game.guildVulgarityON(message.guild.id)
                    return message.channel.send("This shit is on fire!")
                
                } else return message.channel.send("This shit is already on fire.") 
            
            } else if(value === "false") {
                if(game.guildIsVulgar(message.guild.id)){
                    game.guildVulgarityOFF(message.guild.id)
                    return message.channel.send("Okay, I love you.")

                } else return message.channel.send("We are already family friendly.")
            
            } else return message.channel.send("Use `true` or `false` to do that.")
        
        } else return message.channel.send("Only administrators can do that.")

    } else if(command === "hide"){
        if(message.member.hasPermission("ADMINISTRATOR")){
            if(!game.papa_is_hidden(message.guild.id)){
               game.hidden_papa(message.guild.id)
               return message.channel.send(`<@${message.author.id}> has hidden the papa.`) 
            
            } else return message.channel.send("The papa is still hidden.")
        
        } else return message.channel.send("Only administrators can do that.")

    } else if(command === "drop"){
        if(message.member.hasPermission("ADMINISTRATOR")){
            if(game.papa_is_hidden(message.guild.id)){
                game.drop_papa(message.guild.id)
                return message.channel.send(`<@${message.author.id}> has dropped the papa!`)
            
            } else message.channel.send("The papa is not hidden.")

        } else return

    } else if(command === "take"){
        let papa_data = game.guilds.get(message.guild.id)
        if(papa_data.has_the_papa === ""){
            papa_data.has_the_papa = message.author.id
            game.guilds.set(message.guild.id, papa_data)
            return message.channel.send(`Now <@${message.author.id}> has the potato!\n${message.member.nickname || message.author.username}, throw me!`)
        
        } else {
            if(papa_data.has_the_papa === message.author.id) return message.channel.send("I'm burning you! Throw me!")
            return message.channel.send(`Someone has the papa...`)
        }
    
    } else if(command === "pass") {
        let papa_data = game.guilds.get(message.guild.id)
        if(papa_data.has_the_papa === message.author.id){
            if(message.mentions.members.size){
                let someone = message.mentions.members.first()
                
                if(someone.id !== message.author.id && someone.id !== bot.user.id){
                    papa_data.has_the_papa = someone.id
                    game.guilds.set(message.guild.id, papa_data)
                    return message.channel.send(`<@${someone.id}> has the papa now, run!`)
                }
            } return message.channel.send("Mention someone and pass him the papa!")
        } else return

    } else if(command === "game"){
        let papa_data = game.guilds.get(message.guild.id)
        
        let embed = new MessageEmbed()
            .setAuthor(bot.user.username, bot.user.avatarURL())
            .setTitle("Game status")
            .setTimestamp()
            .setColor("#d6a871")
            .setImage("https://i.imgur.com/FI5whva.png")
            .addField("Papa is hidden", `${papa_data.papa_is_hidden}`)

        if(!papa_data.papa_is_hidden){
            if(papa_data.has_the_papa === "") embed.addField("Who has the papa", "The papa is on the floor!")
            else {
                let has_the_papa = message.guild.members.cache.get(papa_data.has_the_papa)
                embed.addField("Who has the papa", has_the_papa.nickname || has_the_papa.user.username)
            }
        } 

        embed.addField("Server is vulgar", `${papa_data.is_vulgar}`)

        return message.channel.send(embed)
    }
    
    
    if(message.content.startsWith("test") && message.author.id === "406226275020177409") {
        // let guildsAndUsers = Game.getGuildsAndUsers(bot.guilds.cache)
        // guildsAndUsers.forEach(guild => {
        //     let selection = Game.chooseUser(guild)
        //     console.log(selection)
        // })
    }

    return
})

module.exports = bot
