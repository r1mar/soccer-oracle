import React from "react";

export default class Prediction {

    constructor(props) {
        super(props);

        this.state = {
            prediction: {},
            errors: []
        };

    }

    async componentDidMount() {
        try {
            let response, teams, error;

            response = await fetch(`/api/prediction/${this.props.match.params.team1}/${this.props.match.params.team2}`);

            if (response.status === 200) {
                prediction = await response.json();

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

    render() {
        return (
            <div>
                <PageHeader history={this.props.history} title="Vorhersage" />
            </div>
        );
    }
}