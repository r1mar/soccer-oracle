const brain = require("brain");
const openLigaDb = require("./openLigaDb");

exports.getPrediction = async function (matches, team1, team2) { 
    const net = new brain.NeuralNetwork();
    const teams = await openLigaDb.teams();
    const matches = await openLigaDb.matches();
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
            return {
                input: [...host, ...guest],
                output: []
            };
    });
    
          input = []

    net.train([{ input: [0, 0], output: [0] },
    { input: [1, 1], output: [0] }]);

    return net.run([1, 0]);


    net.train(trainingData);

    net.run({ blue: 1 })

}