const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('app/build'));

app.get('/api', (req, res) => {
  let spieltag = 9,
    season = 2021,
    regex = /([0-9]{1,2}[.][0-9]{1,2}[.][0-9]{4})([, :<\/="0-9a-z_]*>){2}([0-9a-z. ]*)/gi,
    uri = `https://www.sportschau.de/fussball/bundesliga/spieltag/ergebnisse104~_eam-14d4fb6c588c7fcebc9c5fd4dfd21e2b_eap__liga-BL1_eap__saison-${season}_eap__spieltag-1-${spieltag}_eap__sportart-fb.html?eap=8oI34N4hym4RDV6dhKK0OnLYM%2FNzIoiKmKv2HkJYKgPxCIifwJGZmigVNLw42zmko7u1BzkuenhteE%2FSifHaWb%2BD5g3qtsFGsnGotmb1PcZSS6XXfYWnKf1ELW46g2DdkfFtPY%2BHqJZgCaUEvpeNMw%3D%3D`;

  res.send('Hello World!');

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'soccer-oracle';
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
 
  const db = client.db(dbName);
 
  client.close();
});
