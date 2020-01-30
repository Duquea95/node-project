const express = require("express");
const getChampions = express.Router();
const axios = require("axios");
const events = require("events");
const eventEmitter = new events.EventEmitter();

const lolUrl = "https://na1.api.riotgames.com/"
const ddragon = "http://ddragon.leagueoflegends.com/cdn/10.2.1/data/en_US/champion.json"
const squareImgUrl = "http://ddragon.leagueoflegends.com/cdn/10.2.1/img/champion/"
require("dotenv").config();

const champRouter = require("./champion");

const LolApiCall = async () => {
    console.log("Get them!");
    const query = await axios.get(lolUrl + "lol/platform/v3/champion-rotations", { headers: { "X-Riot-Token": process.env.LOL_API_KEY } });
    const dd = await axios.get(ddragon);

    const champId = query.data.freeChampionIds;

    let showChamp = []

    for (x in dd.data.data) {
        // console.log(x + " " + dd.data.data[x]);
        for (y in dd.data.data[x]) {
            if (y == "key") {
                var temp = dd.data.data[x][y];
                // console.log(temp);

                champId.forEach(function (item, index) {
                    if (item == temp) {
                        var squareAssetLink = squareImgUrl + dd.data.data[x]["id"] + ".png";
                        if (dd.data.data[x]["id"] == "MonkeyKing") {
                            showChamp[index] = {
                                name: dd.data.data[x]["name"],
                                id: item, sqImg: squareAssetLink
                            }
                        }
                        else {
                            showChamp[index] = {
                                name: dd.data.data[x]["id"],
                                id: item, sqImg: squareAssetLink
                            }
                        }

                    }
                });
            }

        }
    }
    return showChamp;
}

const getWeeklyChamps = async () => {

};

getChampions.use("/", champRouter);

getChampions.get("/", async (req, res) => {
    let showChamp = []

    showChamp = await LolApiCall();

    console.log(showChamp);

    res.render("index", { ids: showChamp });
})

getChampions.get("/champion/:champion", async (req, res, next) => {
    console.log("WE are getting champ info");
});


module.exports = getChampions