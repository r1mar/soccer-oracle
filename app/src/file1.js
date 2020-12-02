import brain from "brain.js";

let network = new brain.NeuralNetwork();

let training = [
  {
    input: {
      "Mönchen Gladbach": 1,
      "Wolfsburg": 1,
      "1.FC Köln": 0,
      "SGE": 0
    },
    output: {
      "Unentschieden": 1
    }
  }, {
    input: {
      "Mönchen Gladbach": 0,
      "Wolfsberg": 0,
      "1.FC Köln": 1,
      "SGE": 1
    },
    output: {
      "Unentschieden": 1
    }
  }
];

network.train(training);

network.run({
  "Mönchen Gladbach": 0,
  "1.FC Köln": 0,
  "Wolfsburg": 1,
  "SGE": 1
})