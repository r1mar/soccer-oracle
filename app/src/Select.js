import React from "react";
import FormGroup from "./FormGroup";

export default class Select extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };
  }

  onInternalError(e) {
    this.setState({
      errors: [e]
    });
  }

  render() {
    let options, spaceOption;

    try {
      if(this.props.options) {
        options = this.props.options.map(option => (
          <option key={option.id} value={option.id}>
            {option.value}
          </option>
        ));
      }
      spaceOption =
        !this.props.required || !this.props.value ? (
          <option key="-1" id="" />
        ) : null;
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }

    return (
      <FormGroup
        forId={this.props.id}
        label={this.props.label}
        errors={[...this.state.errors, ...this.props.errors]}
        inline={this.props.inline}
      >
        <select
          id={this.props.id}
          name={this.props.id}
          onChange={this.props.onChange}
          value={this.props.value}
          className={
            [...this.state.errors, ...this.props.errors].length
              ? "form-control is-invalid"
              : "form-control"
          }
          required={this.props.required}
        >
          {spaceOption}
          {options}
        </select>
      </FormGroup>
    );
  }
}
