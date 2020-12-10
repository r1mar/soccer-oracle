const teams = require("./teams.json");
const matches = require("./matches.json");

global.fetch = require("node-fetch");

async function callOpenLigaDb(dbUri, dbRes) {
    if (process.env.https_proxy) {
        return dbRes;

    } else {
        var currentDate = new Date(),
            currentYear = currentDate.getFullYear(),
            currentMonth = currentDate.getMonth(),
            year = currentMonth >= 5 ? currentYear : --currentYear;

        uri = dbUri + year;

        var response = await fetch(uri, {
            headers: {
                accept: "application/json"
            }
        });
        if (response.ok) {
            return response.json();

        } else {
            var text = await res.text();

            throw new Error(text);

        }
    }
}

exports.teams = function () {
    return callOpenLigaDb("https://www.openligadb.de/api/getavailableteams/bl1/", teams);
};


exports.matches = function () {
    return callOpenLigaDb("https://www.openligadb.de/api/getmatchdata/bl1/", matches);
};
