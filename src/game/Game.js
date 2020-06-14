const {Guild, GuildMember, Collection} = require("discord.js")

/**
 * @typedef papa_memory
 * @property {string[]} online_user_ids
 * @property {string} has_the_papa
 * @property {boolean} is_vulgar
 * @property {boolean} papa_is_hidden
 */

class Game {
    constructor(){
        /**@type {Map<string, papa_memory>} */
        this.guilds = new Map()

    }

    getRandomUser(guild_id){
        let guild = this.guilds.get(guild_id)
        let users = guild.online_user_ids
        return users[Math.floor(Math.random() * users.length)]
    }
    
    // /**
    //  * 
    //  * @param {{guild: string[]}} guildAndUsers
    //  * @returns {{guild:string}} {{guild:string}[]}
    //  */
    // static chooseUser = guildAndUsers => {
    //     let guildId = Object.keys(guildAndUsers)[0]
    //     guildAndUsers[guildId] = guildAndUsers[guildId][Math.floor(Math.random() * guildAndUsers[guildId].length)]
    //     return guildAndUsers
    // }

    

    /**
     * @param {Guild} guild
     * @param {Collection<string, GuildMember>}
     */
    static fromGuildGetOnlineUserIds(guild) {
        return guild.members.cache
            .filter(member => (!member.user.bot && member.user.presence.status !== "offline"))
            .map(member => member.id)
    }

    /**
     * 
     * @param {Collection<string, Guild>} guilds 
     */
    setGuildsAndUsers(guilds){
        guilds.forEach((guild, id) => {
            let online_user_ids = Game.fromGuildGetOnlineUserIds(guild)
            let a_user = online_user_ids[Math.floor(Math.random() * online_user_ids.length)]

            this.guilds.clear()
            this.guilds.set(guild.id, {
                online_user_ids: online_user_ids,
                is_vulgar: false,
                has_the_papa: a_user,
                papa_is_hidden: false
            })
        })
    }

    refreshGuildsAndUsers(guilds){
        guilds.forEach(guild => {
            let online_user_ids = Game.fromGuildGetOnlineUserIds(guild)
            this.guilds.forEach((guild, id)=> {
                guild.online_user_ids = online_user_ids
                let a_user = this.getRandomUser(id)
                guild.has_the_papa = a_user
            })
        })
    }


    guildVulgarityON(guild_id){
        if(this.guilds.has(guild_id)){
            let papa_data = this.guilds.get(guild_id)
            papa_data.is_vulgar = true
            this.guilds.set(guild_id, papa_data)
        }
    }

    guildVulgarityOFF(guild_id){
        if(this.guilds.has(guild_id)){
            let papa_data = this.guilds.get(guild_id)
            papa_data.is_vulgar = false
            this.guilds.set(guild_id, papa_data)
        }
    }

    guildIsVulgar(guild_id){
        if(this.guilds.has(guild_id)){
            let papa_data = this.guilds.get(guild_id)
            return papa_data.is_vulgar
        }
    }

    hidden_papa(guild_id){
        if(this.guilds.has(guild_id)){
            let papa_data = this.guilds.get(guild_id)
            papa_data.papa_is_hidden = true
            papa_data.has_the_papa = "hidden"
        }
    }

    drop_papa(guild_id){
        if(this.guilds.has(guild_id)){
            let papa_data = this.guilds.get(guild_id)
            papa_data.papa_is_hidden = false
            papa_data.has_the_papa = ""
        }
    }

    papa_is_hidden(guild_id){
        if(this.guilds.has(guild_id)){
            let papa_data = this.guilds.get(guild_id)
            return papa_data.papa_is_hidden
        }
    }
    
}

module.exports = Game