const express = require("express");
const champions = express.Router();

// const getChampRouter = require("./getChampions");

// champions.use("/champion/:champion", getChampRouter);

champions.param("champion", (req, res, next, value) => {
    console.log(value);
    req.champion = value;

    return next()
});

champions.get("/champion/:champion", (req, res, next) => {
    res.render('champion', { title: req.champion });
});

module.exports = champions