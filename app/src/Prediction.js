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
            let response, teams, error,
              sort = (a,b) => {
                        let key1 = Object.keys(a)[0],
                            key2 = Object.keys(b)[0];

                        return a[key1] - b[key2];
                      };

            response = await fetch(`/api/prediction/${this.props.match.params.team1}/${this.props.match.params.team2}`);

            if (response.status === 200) {
                prediction = await response.json();

                this.setState({
                    prediction: {
                      winner: prediction.splice(0,3).sort(sort)[0],
                      goals1: prediction.splice(3,10).sort(sort)[0],
                      goals2: prediction.splice(13).sort(sort)[0]
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
