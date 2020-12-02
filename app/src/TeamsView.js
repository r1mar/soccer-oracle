import React from "react";
import service from "./Service";
import Alert from "./Alert";
import Table from "./Table";
import PageHeader from "./PageHeader";

export default class TeamsView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: [],
      errors: []
    };

    this.showTeam = this.showTeam.bind(this);
    this.deleteTeams = this.deleteTeams.bind(this);
    this.createTeam = this.createTeam.bind(this);
  }

  async componentDidMount() {
    try {
      let teams = await service.readEntities("/teams");

      this.setState({
        teams: teams
      });
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  async deleteTeams(ids, items) {
    try {
      ids.map(async id => {
        await service.deleteEntity("/team/" + id);
      });

      this.setState({
        teams: this.state.teams.filter(team => items.indexOf(team) === -1)
      });

    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  createTeam() {
    try {
      this.props.history.push("/team");
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  showTeam(event) {
    try {
      event.preventDefault();

      this.props.history.push("/team/" + event.target.id);
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  render() {
    return (
      <div>
        <PageHeader title="Vereine" history={this.props.history} />

        <Table
          rows={this.state.teams}
          columns={[
            {
              id: 1,
              label: "#",
              name: "id"
            },
            {
              id: 2,
              label: "Name",
              name: "name",
              navigation: this.showTeam
            }
          ]}
          delete={this.deleteTeams}
          create={this.createTeam}
        />

        <Alert messages={this.state.errors} />
      </div>
    );
  }
}
