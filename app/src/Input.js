import React from "react";
import FormGroup from "./FormGroup";

export default class Input extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: []
    };

    this.onInternalError = this.onInternalError.bind(this);
  }

  onInternalError(e) {
    this.setState({
      errors: [e]
    });
  }

  render() {
    let errors = [...this.props.errors, ...this.state.errors];
    
    return (
      <FormGroup
        forId={this.props.id}
        label={this.props.label}
        errors={errors}
        inline={this.props.inline}
        onInternalError={this.onInternalError}
      >
        <input
          id={this.props.id}
          name={this.props.id}
          type={this.props.type}
          className={
            errors.length
              ? "form-control is-invalid"
              : "form-control"
          }
          onChange={this.props.onChange}
          value={this.props.value}
          required={this.props.required}
          min={props.min}
        />
      </FormGroup>
    );
  }
}
