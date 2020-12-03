import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App";
import NotFound from "./NotFound";
import TeamsView from "./TeamsView";
import TeamView from "./TeamView";
import MatchesView from "./MatchesView";
import MatchView from "./MatchView";
import * as serviceWorker from './serviceWorker';

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/teams" component={TeamsView} />
      <Route path="/team/:id" component={TeamView} />
      <Route path="/team" component={TeamView} />
      <Route path="/matches" component={MatchesView} />
      <Route path="/match/:id" component={MatchView} />
      <Route path="/match" component={MatchView} />
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