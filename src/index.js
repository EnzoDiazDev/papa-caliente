if(process.env.NODE_ENV == "development") require("dotenv").config()
const bot = require("./bot")

async function main() {
    bot.login(process.env.BOTKEY)
}

main()
