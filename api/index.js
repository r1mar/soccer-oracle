const express = require("express");
const app = express();
const port = 3000;
const openLigaDb = require("./openLigaDb");
const brain = require("./brain");
const db = require("./mongo");

app.use(express.static("app/build"));

app.get("/api/teams", async (req, res, next) => {
  try {
    var teams = await db.getTeams(); //openLigaDb.teams()

    if (teams) {
      res.json(teams);
    } else {
      res.status(404).send("Nicht gefunden");
    }

  } catch (e) {
    next(e);
  }
});

app.get("/api/prediction/:team1/:team2", async (req, res, next) => {
  try {
    const prediction = await brain.getPrediction(+req.params.team1, +req.params.team2);

    res.json(prediction);

  } catch (e) {
    next(e);
  }
});

app.use(function (err, req, res) {
  res.status(500).send(err.message);
});

app.use(function (req, res) {
  res.status(404).send("Nicht gefunden");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  db.connect();
});

