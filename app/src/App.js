import React from "react";
import PageHeader from "./PageHeader";
import Alert from "./Alert";
import Form from "./Form";
import Select from "./Select";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      team1: {},
      team2: {},
      errors: []
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onSelectTeam = this.onSelectTeam.bind(this);
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

  onSelectTeam(event) {
    try {
      if (event.target.id === "cmbTeam1") {
        this.setState({
          team1: this.state.teams.find(team => team.TeamId === event.target.value)
        });
      } else {
        this.setState({
          team2: this.state.teams.find(team => team.TeamId === event.target.value)
        });
      }

    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  onSubmit(event) {
    event.preventDefault();
  }

  render() {
    let teams = this.state.teams.map(team => <option value={team.TeamId}><img src={team.TeamIconUrl} /> {team.TeamName}</option>);

    return (
      <div>
        <PageHeader history={this.props.history} title="Startseite" />
         <Form onSubmit={this.onSubmit}>
          <Select
            id="cmbTeam1"
            required={true}
            onChange={this.onSelectTeam}
            value={this.state.team1.TeamId}
          >{teams}</Select>
          <Select
            id="cmbTeam2"
            required={true}
            onChange={this.onSelectTeam}
            value={this.state.team2.TeamId}
          >{teams}</Select>
        <Alert messages={this.state.errors} />
      </div>
    );
  }
}
