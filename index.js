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
    "token": "", //The Bot Token
    "guild": "", //The current discord guild
    "admin": "", //A dev team / admin role that's allowed to force a update
    "servers": [
        "",
        //"SERVERNAME IP:PORT DISCORDCHANNELID"
    ]
};
let updatePlayerInterval = setInterval(() => updatePlayers(), 30000);
function updatePlayers() {
    config.servers.forEach(server => {
        var args = server.split(" ");
        let guild = bot.guilds.get(config.guild);
        if (guild) {
            var channel = guild.channels.get(args[2]);
        }
        http.get(`http://${args[1]}/info.json`, { json: true }, (err, res, info) => {
            if (err) {
                if (err.code == "ECONNREFUSED" || err.code == "ETIMEDOUT") {
                    if (channel) {
                        channel.setName(`${args[0]}: Offline`);
                        return;
                    }
                }
            }
            http.get(`http://${args[1]}/players.json`, { json: true }, (err, res, players) => {
                if (err)
                    throw err;
                if (channel) {
                    channel.setName(`${args[0]}: ${players.length}/${info.vars.sv_maxClients}`);
                }
            });
        });
    });
}
bot.login(config.token).catch(console.error);
bot.on("message", message => {
    if (message.content == "5m=update" && message.member.roles.has(config.devteam)) {
        if (message.deletable) {
            message.delete();
        }
        updatePlayers();
        message.reply("Forced a update of the player count(s).");
    }
});
