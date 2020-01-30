// Required External Packages
const express = require("express");
const path = require("path");

const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const axios = require("axios");
const lolUrl = "https://na1.api.riotgames.com/"
const ddragon = "http://ddragon.leagueoflegends.com/cdn/10.2.1/data/en_US/champion.json"
const squareImgUrl = "http://ddragon.leagueoflegends.com/cdn/10.2.1/img/champion/"

require("dotenv").config();

const authRouter = require("./routes/auth");
const getChampionsRouter = require("./routes/getChampions");
const champRouter = require("./routes/champion");

// App Variables
const app = express();
const port = process.env.PORT || "3000";

// Session Configurations
const session = {
    secret: "secretLongString",
    cookie: {},
    resave: false,
    saveUninitialized: false
};

if (app.get("env") === "production") {
    session.cookie.secure = true;
}

// Passport Configurations - define strategy
const strategy = new Auth0Strategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        return done(null, profile);
    }
)

// App Configurations
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));

// use strategy in passport
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
})

// Creating custom middleware with Express
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// Routing
app.use("/", authRouter);
app.use("/", champRouter);
app.use("/", getChampionsRouter);

const secured = (req, res, next) => {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalURL;
    res.redirect("/login");
}

app.get("/user", secured, (req, res, next) => {
    const { _raw, _json, ...userProfile } = req.user;
    res.render("user", { title: "Profile", userProfile: userProfile })
});

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/logout", (req, res) => {
    res.render("index", { title: "Home" });
});

app.listen(port, () => {
    console.log('Listening to requests on localhost');
});