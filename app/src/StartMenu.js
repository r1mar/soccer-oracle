import React from "react";
import "./style.css";
import PageHeader from "./PageHeader";
import Alert from "./Alert";

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      errors = []
    };
  }

  async componentDidMount() {
    try {
      let response = await fetch("/api");

      this.setState({
        message: await response.text()
      });
    } catch(e) {
      this.setState({
        errors: [e]
      };
    }
  }

  render() {
    return (
      <div>
        <PageHeader history={this.props.history} title="Startseite" />
        <h2>{this.state.message}</h2>
        <Alert messages={this.state.errors} />
      </div>
    );
  }
}
