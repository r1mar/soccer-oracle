const express = require("express");
const app = express();
const port = 3000;
const openLigaDb = require("./openLigaDb");
const brain = require("./brain");

global.fetch = require("node-fetch");

app.use(express.static("app/build"));

app.get("/api/teams", (req, res, next) => {
  openLigaDb.teams(res, next)
    .then( teams => {
      if(teams) {
        res.json(teams);
      }
    });
});

app.get("/api/prediction/:team1/:team2", (req, res, next) => {
  openLigaDb.matches(res, next)
    .then(matches => {
      res.json(brain.getPrediction(matches, team1, team2));
    });
});

app.use(function (err, req, res) {
  res.status(500).send(err.message);
  console.log("500 - " + err.message);
});

app.use(function (req, res) {
  res.status(404).send("Nicht gefunden");
  condole.log("404 - Nicht gefunden");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

