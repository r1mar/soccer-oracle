import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App";
import Prediction from "./Prediction";
import NotFound from "./NotFound";
import * as serviceWorker from './serviceWorker';

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/prediction/:team1/:team2" component={Prediction} />
      <Route path="/not-found" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();