import React from "react";
import service from "./Service";
import Alert from "./Alert";
import Table from "./Table";
import PageHeader from "./PageHeader";

export default class MatchesView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.deleteMatches = this.deleteMatches.bind(this);
    this.showMatch = this.showMatch.bind(this);
    this.getName = this.getName.bind(this);
    this.createMatch = this.createMatch.bind(this);
  }

  async componentDidMount() {
    try {
      let matches = await service.readEntities("/matches");

      this.setState({
        matches: matches
      });
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  async deleteMatches(toDeleteIds, toDeleteMatches) {
    try {
      let result = await service.deleteMatches(toDeleteIds);

      this.setState({
        matches: this.state.matches.filter(
          match => toDeleteMatches.indexOf(match) === -1
        )
      });

      return result;
    } catch (e) {
      this.setState = {
        errors: [e]
      };

      return null;
    }
  }

  getName(match) {
    try {
    return match.host.name + " : " + match.guest.name;
    } catch(e) {
      this.setState({
        errors: [e]
      });
      return e.message;
    }
  }

  showMatch(event) {
    try {
      event.preventDefault();

      this.props.history.push("/match/" + event.target.id);
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  createMatch() {
    try {
      this.props.history.push("/match");
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  render() {
    return (
      <div>
        <PageHeader title="Spiele" history={this.props.history} />

        <Table
          rows={this.state.matches}
          columns={[
            {
              id: 1,
              label: "#",
              name: "id"
            },
            {
              id: 2,
              label: "SpielTage",
              name: "gameDay",
              type: "date"
            },
            {
              id: 3,
              label: "Spiel",
              name: this.getName,
              navigation: this.showMatch
            }
          ]}
          delete={this.deleteMatches}
          create={this.createMatch}
        />
        <Alert messages={this.state.errors} />
      </div>
    );
  }
}
