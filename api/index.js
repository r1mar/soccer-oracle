const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('app/build'));

app.get('/api/teams', (req, res, next) => {
  var currentDate = new Date(),
      currentYear = currentDate.getFullYear(),
      currentMonth = currentDate.getMonth(),
      year = currentMonth >= 6 ? currentYear : --currentYear;

  fetch('https://www.openligadb.de/api/getavailableteams/bl1/' + year)
    .then(function(teams) {
      return red.json(teams);
    });
});

app.use(function(err, req, res) {
  res.status(500).send(err.message);
  console.log('500 - ' + err.message);
});

app.use(function(req, res) {
  res.status(404).send('Nicht gefunden');
  condole.log('404 - Nicht gefunden');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');
 
// Connection URL
//const url = 'mongodb://localhost:27017';
 
// Database Name
//const dbName = 'soccer-oracle';
 
// Use connect method to connect to the server
//MongoClient.connect(url, function(err, client) {
//  assert.equal(null, err);
//  console.log("Connected successfully to server");
 
//  const db = client.db(dbName);
 
//  client.close();
//});
