import React from "react";
import PageHeader from "./PageHeader";
import Alert from "./Alert";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      errors: []
    };
  }

  async componentDidMount() {
    try {
      let response = await fetch("/api/teams"),
        teams = await response.json();

      this.setState({
        teams: teams
      });
    } catch(e) {
      this.setState({
        errors: [e]
      });
    }
  }

  render() {
    let teams = this.state.teams.map(team => <h2>{team.TeamName}</h2>);

    return (
      <div>
        <PageHeader history={this.props.history} title="Startseite" />
        {teams}
        <Alert messages={this.state.errors} />
      </div>
    );
  }
}
