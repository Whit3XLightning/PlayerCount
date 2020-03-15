"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("request"));
const discord = __importStar(require("discord.js"));
const bot = new discord.Client;
const config = {
    "token": "", //The token of your discord bot.
    "guild": "", //The guild (id) with those \/ channels.
    "devteam": "", // A admin / dev role that is allowed to force an update of the player count with 5m=update.
    "refreshtime": 30, // how often the player count is updated in seconds.
    "servers": [
        "",
        //"name ip:port DiscordVoiceChannelID"
    ]
};
console.log(`Starting bot...\n Created by Whit3Xlightning (https://whitelightning.dev)`);
bot.on("message", message => {
    if (message.content == "5m=update" && message.member.roles.has(config.devteam)) {
        if (message.deletable) {
            message.delete();
        }
        updatePlayers();
        message.reply("Forced a update of the player count(s).");
    }
});
bot.login(config.token);
let updatePlayerInterval = setInterval(() => updatePlayers(), config.refreshtime * 1000);
function updatePlayers() {
    config.servers.forEach(server => {
        var args = server.split(" ");
        let guild = bot.guilds.get(config.guild);
        if (guild) {
            var channel = guild.channels.get(args[2]);
        }
        http.get(`http://${args[1]}/dynamic.json`, { json: true }, (err, res, data) => {
            if (err) {
                if (err.code == "ECONNREFUSED" || err.code == "ETIMEDOUT") {
                    if (channel) {
                        channel.setName(`${args[0]}: Offline`);
                        return;
                    }
                }
            }
            if (channel) {
                channel.setName(`${data.clients} / ${data.sv_maxclients}`);
            }
            console.log(`${new Date().toISOString()}: ${data.clients} / ${data.sv_maxclients}`);
        });
    });
}
