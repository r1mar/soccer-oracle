const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

exports.getTeams = async () => {
  try {
    await client.connect();

    const database = client.db("soccer-oracle");
    const collection = database.collection("teams");

    collection.find({}, { 
      _id: false, 
      TeamName: true, 
      TeamId: true }, {
        sort: "Teamname"
      }).toArray((err, result) => {
        if(err) {
          throw err;
        }

        return result;
      });

      return teams;

  } finally {
    await client.close();
  }

}
