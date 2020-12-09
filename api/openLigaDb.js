const teams = require("./teams.json");
const matches = require("./matches.json");

function callOpenLigaDb(dbUri, dbRes, res, next) {
    if (process.env.https_proxy) {
        res.json(dbRes);

    } else {
        var currentDate = new Date(),
            currentYear = currentDate.getFullYear(),
            currentMonth = currentDate.getMonth(),
            year = currentMonth >= 5 ? currentYear : --currentYear;

        uri = dbUri + year;

        return fetch(uri, {
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

            });
    }
}

exports.teams = function (res, next) {
    return callOpenLigaDb("https://www.openligadb.de/api/getavailableteams/bl1/", teams, res, next);
};


exports.matches = function (res, next) {
    return callOpenLigaDb("https://www.openligadb.de/api/getmatchdata/bl1/", matches, res, next);
};