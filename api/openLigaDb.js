const teams = require("./teams.json");
const matches = require("./matches.json");

global.fetch = require("node-fetch");

function callOpenLigaDb(dbUri, dbRes) {
    return new Promise(resolve, reject => {
    if (process.env.https_proxy) {
        resolve(dbRes);

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
                        reject(new Error(text));
                    });

                } else {
                    resolve(res.json());

                }

            })
            .catch(e => {
                reject(e);

            });
    }});
}

exports.teams = function (next) {
    return callOpenLigaDb("https://www.openligadb.de/api/getavailableteams/bl1/", teams, res, next);
};


exports.matches = function (next) {
    return callOpenLigaDb("https://www.openligadb.de/api/getmatchdata/bl1/", matches, res, next);
};
