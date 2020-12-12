const brain = require("brain");
const openLigaDb = require("./openLigaDb");

exports.train = (teams, matches) => {
  const net = new brain.NeuralNetwork();
  const trainData = matches.filter(match => match.MatchIsFinished)
        .sort(( a, b ) => {
            if ( a.MatchDateTimeUTC < b.MatchDateTimeUTC ){
                return -1;
            }
            if ( a.MatchDateTimeUTC > b.MatchDateTimeUTC ){
                return 1;
            }
                return 0;
            })
        .map(match => {
            const host = teams.map(team => team.TeamId === match.Team1.TeamId ? 1 : 0),
                  guest = teams.map(team => team.TeamId === match.Team2.TeamId ? 1 : 0),
                  matchResult = match.MatchResults.find(matchResult => matchResult.ResultTypeID === 2);

            var winner = [{ 
                [match.team1.TeamName]: 0
              }, { 
                "Unentschieden": 0
              }, {
                [match.team2.TeamName]: 0
            }];

            if(matchResult.PointsTeam1 > matchResult.PointsTeam2) {
              winner[0][match.team1.TeamName] = 1;
            }

            if(matchResult.PointsTeam1 === matchResult.PointsTeam2) {
              winner[1].Unentschieden = 1;
            }

            if(matchResult.PointsTeam1 < matchResult.PointsTeam2) {
              winner[2][match.team2.TeamName] = 1;
            }

            var goalsHost = [], goalsGuest = [], goalLabel;

            do {
              goalLabel = (goalsHost.length + 1).toString();
              goalLabel = goalsHost.length >= 10 ? ">= " + goalLabel : goalLabel;
              goalsHost.push(matchResult.PointsTeam1 === goalsHost.length + 1 || goalsHost.length === 10 ? { [goalLabel]: 1 } : { [goalLabel]: 0 };
              goalsGuest.push(matchResult.PointsTeam2 === goalsGuest.length + 1 || goalsGuest.length === 10 ? { [goalLabel]: 1 } : { [goalLabel]: 0 };
            } while(goalsHost.length < 10)

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
    const teams = await openLigaDb.teams();
    const matches = await openLigaDb.matches();
    const net = exports.train(teams, matches);
   
    return exports.run(net, teams, team1, team2);
}
