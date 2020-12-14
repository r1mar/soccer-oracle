const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://<user>:<password>@<cluster-url>?w=majority";
const client = new MongoClient(uri);

exports.sync = async () => {
  try {
    await client.connect();

    const database = client.db("soccer-oracle");
    const collection = database.collection("brains");
    
    // Query for a smartest brain that knows the latest matches
    const query = { };
    const options = {
      // sort matched documents in descending order by change-date
      sort: { "change-date": -1 },
      // Include only the `title` and `imdb` fields in the returned document
      projection: { _id: 0, brain: 1, "change-date": 1 },
    };
    const brain = await collection.findOne(query, options);
    // since this method returns the matched document, not a cursor, print it directly
    

  } finally {
    await client.close();
  }
}
