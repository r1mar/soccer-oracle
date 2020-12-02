import React from "react";
import service from "./Service";
import Form from "./Form";
import RapidComboBox from "./RapidComboBox";
import RapidNumberBox from "./RapidNumberBox";
import RapidDateBox from "./RapidDateBox";
import NotFoundError from "./NotFoundError";
import FieldError from "./FieldError";
import PageHeader from "./PageHeader";

export default class MatchView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      match: {
        gameDay: "",
        host: {
          goals: 0
        },
        guest: {
          goals: 0
        }
      },
      errors: []
    };
    this.save = this.save.bind(this);
    this.onSelectTeam = this.onSelectTeam.bind(this);
    this.onChangeGoal = this.onChangeGoal.bind(this);
    this.onChangeGameDay = this.onChangeGameDay.bind(this);
  }

  async componentDidMount() {
    try {
      this.setState({
        errors: []
      });

      if (this.props.match.params.id) {
        this.setState({
          match: await service.readEntity(
            "/match/" + this.props.match.params.id
          )
        });
      }
    } catch (e) {
      if (e instanceof NotFoundError) {
        this.props.history.push("/not-found");
      } else {
        this.setState(state => ({
          errors: [e]
        }));
      }
    }
  }

  async save(event) {
    try {
      let match;
      event.preventDefault();

      this.setState({
        errors: [],
        sent: true
      });

      if (this.props.match.params.id) {
        match = await service.updateEntity(
          "/match/" + this.state.match.id,
          this.state.match
        );
      } else {
        match = await service.createEntity("/matches", this.state.match);

        this.props.history.push("/match/" + match.id);
      }
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  onSelectTeam(event, team) {
    try {
      let newMatch = Object.assign({}, this.state.match);

      if (event.target.id === "cmbTeam1") {
        newMatch.host = Object.assign({}, this.state.match.host, team);
      } else {
        newMatch.guest = Object.assign({}, this.state.match.guest, team);
      }

      this.setState({
        match: newMatch,
        sent: false
      });
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  onChangeGameDay(event) {
    try {
      this.setState({
        match: Object.assign({}, this.state.match, {
          gameDay: event.target.value
        }),
        sent: false
      });
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  onChangeGoal(event) {
    try {
      let newMatch = Object.assign({}, this.state.match);

      if (event.target.id === "txtGoals1") {
        newMatch.host.goals = Number.isInteger(event.target.value)
          ? +event.target.value
          : event.target.value;
      } else {
        newMatch.guest.goals = Number.isInteger(event.target.value)
          ? +event.target.value
          : event.target.value;
      }

      this.setState({
        match: newMatch,
        sent: false
      });
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  render() {
    let errors = this.state.errors,
      title;

    try {
      title = this.state.match.id
        ? "Spiel #" + this.state.match.id
        : "Neues Spiel";
    } catch (e) {
      errors = [e];
    }

    return (
      <div>
        <PageHeader title={title} history={this.props.history} />

        <Form onSubmit={this.save} errors={errors} validated={this.state.sent}>
          <RapidDateBox
            id="txtGameday"
            meta="/match/gameDay"
            onChange={this.onChangeGameDay}
            value={this.state.match.gameDay}
            errors={errors.filter(
              error => error instanceof FieldError && error.field === "gameDay"
            )}
          />
          <RapidComboBox
            id="cmbTeam1"
            onChange={this.onSelectTeam}
            value={this.state.match.host.id}
            meta="/match/host"
            errors={errors.filter(
              error => error instanceof FieldError && error.field === "host.id"
            )}
          />
          <RapidComboBox
            id="cmbTeam2"
            meta="/match/guest"
            onChange={this.onSelectTeam}
            value={this.state.match.guest.id}
            errors={errors.filter(
              error => error instanceof FieldError && error.field === "guest.id"
            )}
          />
          <div className="form-row">
            <RapidNumberBox
              id="txtGoals1"
              onChange={this.onChangeGoal}
              value={this.state.match.host.goals}
              meta="/participant/goals"
              errors={errors.filter(
                error =>
                  error instanceof FieldError && error.field === "host.goals"
              )}
              inline={true}
            />
            <RapidNumberBox
              id="txtGoals2"
              onChange={this.onChangeGoal}
              value={this.state.match.guest.goals}
              meta="/participant/goals"
              errors={errors.filter(
                error =>
                  error instanceof FieldError && error.field === "guest.goals"
              )}
              inline={true}
            />
          </div>
        </Form>
      </div>
    );
  }
}
