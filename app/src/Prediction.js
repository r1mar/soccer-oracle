import React from "react";
import PageHeader from "./PageHeader";

export default class Prediction extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            prediction: {
                team1: {},
                team2: {},
                "final-score": {
                    team1: {},
                    team2: {}
                }
            },
            errors: []
        };

    }

    async componentDidMount() {
        try {
            let response, teams, error,
              sort = (a,b) => {
                        let key1 = Object.keys(a)[0],
                            key2 = Object.keys(b)[0];

                        return a[key1] - b[key2];
                      };

            response = await fetch(`/api/prediction/${this.props.match.params.team1}/${this.props.match.params.team2}`);

            if (response.status === 200) {
                this.setState({
                    prediction: await response.json()
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

    render() {
        let draw = this.state.prediction.draw ? <p>ended mit einem Unentschieden({this.state.prediction.draw.probability}%)</p> : null,
            winner = this.state.prediction.winner ? <p> mit einem Sieg von {this.state.prediction.winner.team.TeamName}({this.state.prediction.winner.probability}%)</p> : null,
            result = <p>{this.state.prediction["final-score"].team1.goals}({this.state.prediction["final-score"].team1.probability}%) : {this.state.prediction["final-score"].team2.goals}({this.state.prediction["final-score"].team2.probability}%)</p>

        return (
            <div>
                <PageHeader history={this.props.history} title="Vorhersage" />
                <p>Das Spiel</p>
                <h2>{this.state.prediction.team1.TeamName} : {this.state.prediction.team2.TeamName}</h2>
                {draw}
                {winner}
                {result}
            </div>
        );
    }
}
