import React from "react";
import PageHeader from "./PageHeader";
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
      let response, teams, error;

      response = await fetch("/api/teams");

      if (response.status === 200) {
        teams = await response.json();

        this.setState({
          teams: teams
        });

      } else {
        error = await response.text();
        throw new Error(error);
      }

    } catch (e) {
      this.setState({
        errors: [e]
      });

    }
  }

  onSelectTeam(event) {
    try {
      if (event.target.id === "cmbTeam1") {
        this.setState({
          team1: this.state.teams.find(team => team.TeamId === +event.target.value)
        });
      } else {
        this.setState({
          team2: this.state.teams.find(team => team.TeamId === +event.target.value)
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

    if (this.state.team1.TeamId != this.state.team2.TeamId) {
      this.history.push(`/prediction/${this.state.team1.TeamId}/${this.state.team2.TeamId}`);

    } else {
      const message = "Wählen Sie unterschiedliche Teams";
      let e = new Error(message),
        errors = [e];

      e.field = "team1";

      e = new Error(message)
      e.field = "team2";
      errors.push(e);

      this.setState({
        errors: errors
      });

    }
  }

  render() {
    let teams = this.state.teams.map(team => ({
      id: team.TeamId,
      value: team.TeamName
    }));

    return (
      <div>
        <PageHeader history={this.props.history} title="Startseite" />
        <Form onSubmit={this.onSubmit} errors={this.state.errors}>
          <Select
            id="cmbTeam1"
            required={true}
            onChange={this.onSelectTeam}
            value={this.state.team1.TeamId}
            errors={this.state.errors.filter(error => error.field === 'team1')}
            options={teams}
          />
          <Select
            id="cmbTeam2"
            required={true}
            onChange={this.onSelectTeam}
            value={this.state.team2.TeamId}
            options={teams}
            errors={this.state.errors.filter(error => error.field === 'team2')}
            />
        </Form>
      </div>
    );
  }
}
