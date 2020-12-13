const brain = require("brain.js");
const openLigaDb = require("./openLigaDb");

exports.train = (teams, matches) => {
    const net = new brain.NeuralNetwork();
    const trainData = matches.filter(match => match.MatchIsFinished)
        .sort((a, b) => {
            if (a.MatchDateTimeUTC < b.MatchDateTimeUTC) {
                return -1;
            }
            if (a.MatchDateTimeUTC > b.MatchDateTimeUTC) {
                return 1;
            }
            return 0;
        })
        .map(match => {
            const host = teams.map(team => team.TeamId === match.Team1.TeamId ? 1 : 0),
                guest = teams.map(team => team.TeamId === match.Team2.TeamId ? 1 : 0),
                matchResult = match.MatchResults.find(matchResult => matchResult.ResultTypeID === 2);

            var winner = [0, 0, 0];

            if (matchResult.PointsTeam1 > matchResult.PointsTeam2) {
                winner[0] = 1;
            }

            if (matchResult.PointsTeam1 === matchResult.PointsTeam2) {
                winner[1] = 1;
            }

            if (matchResult.PointsTeam1 < matchResult.PointsTeam2) {
                winner[2] = 1;
            }

            var goalsHost = [], goalsGuest = [];

            do {
                goalsHost.push(matchResult.PointsTeam1 === goalsHost.length + 1 || goalsHost.length === 10 ? 1 : 0);
                goalsGuest.push(matchResult.PointsTeam2 === goalsGuest.length + 1 || goalsGuest.length === 10 ? 1 : 0);
            } while (goalsHost.length < 10)

            return {
                input: [...host, ...guest],
                output: [...winner, ...goalsHost, ...goalsGuest]
            };
        });

    net.train(trainData);

    return net;
}

exports.run = (net, teams, team1, team2) => {
    const host = teams.map(team => team.TeamId === team1 ? 1 : 0),
        guest = teams.map(team => team.TeamId === team2 ? 1 : 0);

    return net.run([...host, ...guest]);
}

exports.getPrediction = async (team1, team2) => {
    const teams = await openLigaDb.teams(),
        matches = await openLigaDb.matches(),
        net = exports.train(teams, matches),
        prediction = exports.run(net, teams, team1, team2);

    var winner = prediction.slice(0, 3),
        max = Math.max(...winner),
        result = {
            team1: teams.find(team => team.TeamId === team1),
            team2: teams.find(team => team.TeamId === team2)
        };

    switch (winner.indexOf(max)) {
        case 0: result.winner = {
            team: result.team1,
            probability: Math.round(max * 100)
        };
            break;
        case 1: result.draw = {
            probability: Math.round(max * 100)
        }
            break;
        default:
            result.winner = {
                team: result.team2,
                probability: Math.round(max * 100)
            };
    }

    var goals = prediction.slice(3, 13);

    result["final-score"] = {};

    max = Math.max(...goals);
    result["final-score"].team1 = {
        goals: goals.indexOf(max) + 1,
        probability: Math.round(max * 100)
    };

    goals = prediction.slice(13, 23);
    max = Math.max(...goals);
    result["final-score"].team2 = {
        goals: goals.indexOf(max) + 1,
        probability: Math.round(max * 100)
    };

    return result;
}
