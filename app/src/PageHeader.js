import React from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert";
import service from "./Service";

export default class PageHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      collapsing: false,
      errors: []
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    try {
      this.setState({
        height: this.divElement.clientHeight
      });
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  toggleMenu() {
    try {
      this.setState({
        collapsing: true
      });

      setTimeout(() => {
        this.setState((state, props) => ({
          collapsed: !state.collapsed,
          collapsing: false
        }));
      }, 350);
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  async download() {
    try {
      let data = await service.readAll();
      let dataUrl =
          "data:text/json;charset=utf8," +
          encodeURIComponent(JSON.stringify(data)),
        aDownload = document.getElementById("downloadDummy");

      aDownload.setAttribute("href", dataUrl);
      aDownload.setAttribute("download", "data.json");

      aDownload.click();
    } catch (error) {
      this.setState({
        errors: [error]
      });
    }
  }

  render() {
    let style = {},
      btnBack;
    try {
      btnBack =
        this.props.history.length &&
        this.props.history.location.pathname !== "/" ? (
          <button
            className="btn btn-link"
            onClick={() => this.props.history.goBack()}
          >
            Zurück{" "}
          </button>
        ) : null;

      if (this.state.collapsed) {
        style.height = this.state.height;
      }
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
    return (
      <div className="row">
        <div className="col">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">
              {this.props.title}
            </Link>
            <button
              onClick={this.toggleMenu}
              className={
                this.state.collapsed
                  ? "navbar-toggler collapsed"
                  : "navbar-toggler"
              }
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded={this.state.collapsed ? "false" : "true"}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className={
                this.state.collapsing
                  ? "navbar-collapse collapsing"
                  : this.state.collapsed
                  ? "navbar-collapse collapse"
                  : "navbar-collapse collapse show"
              }
              {...style}
              id="navbarSupportedContent"
            >
              <ul
                className="navbar-nav mr-auto"
                ref={divElement => {
                  this.divElement = divElement;
                }}
              >
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Vereine
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/matches">
                    Spiele
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={this.download}>
                    Exportieren
                  </a>
                  <a id="downloadDummy" style={{ display: "none" }} />
                </li>
              </ul>
            </div>
          </nav>
          {btnBack}
          <Alert messages={this.state.errors} />
        </div>
      </div>
    );
  }
}
