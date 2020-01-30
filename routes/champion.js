const express = require("express");
const champions = express.Router();

const getChampionsRouter = require("./getChampions");

champions.use('/', (req, res, next) => {
    next();
});

champions.param("champion", (req, res, next, value) => {
    console.log(value);
    req.champion = value;

    return next()
});

champions.get("/champion/:champion", (req, res, next) => {
    res.render('champion', { title: req.champion });
});

module.exports = champions