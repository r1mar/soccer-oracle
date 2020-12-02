import React from "react";
import "./style.css";
import PageHeader from "./PageHeader";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <PageHeader history={this.props.history} title="Startseite" />
    );
  }
}
