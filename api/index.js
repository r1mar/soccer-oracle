const express = require("express");
const app = express();
const port = 3000;
const teams = require("./teams.json");

global.fetch = require("node-fetch");

app.use(express.static("app/build"));

app.get("/api/teams", (req, res, next) => {
  if (process.env.https_proxy) {
    res.json(teams);

  } else {
    var currentDate = new Date(),
      currentYear = currentDate.getFullYear(),
      currentMonth = currentDate.getMonth(),
      year = currentMonth >= 5 ? currentYear : --currentYear;

    uri = "https://www.openligadb.de/api/getavailableteams/bl1/" + year;


    fetch(uri, {
        headers: {
          accept: "application/json"
        }
      })
      .then(function (res) {
        if (!res.ok) {
          res.text().then(function (text) {
            next(new Error(text));
          });

        } else {
          return res.json();

        }

      })
      .catch(function (e) {
        next(e);

      })
      .then(function (json) {
        if (json) {
          res.json(json);
        }

      });
  }
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

