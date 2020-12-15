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
            /*let response, teams, error,
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
            }*/

        } catch (e) {
            this.setState({
                errors: [e]
            });

        }
    }

    render() {
        return (
            <div>
                <PageHeader history={this.props.history} title="Setup" />
            </div>
        );
    }
}
