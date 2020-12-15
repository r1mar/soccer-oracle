const { MongoClient } = require("mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

exports.connect = async () => {
  await client.connect();

  process.on('exit', function () {
    this.close();
  }.bind(client));
}

exports.getTeams = async () => {
  const database = client.db("soccer-oracle")
  const collection = database.collection("teams");

  const teams = await collection.find({}).project({
    _id: 0,
    TeamName: 1,
    TeamId: 1
  }).sort({
    TeamName: 1
  }).toArray((err, result) => {
    if (err) {
      throw err;
    }

    return result;
  });

  return teams;

}
