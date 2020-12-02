import React from "react";
import NumberBox from "./NumberBox";
import service from "./Service";

export default class RapidNumberBox extends React.Component {
  constructor(props) {
    super(props);
    
    this.state ={
      metadata: {},
      errors: []
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        metadata: await service.readMetadata(this.props.meta)
      })
    } catch(e) {
      this.setState({
        errors: [e]
      })
    }
  }
  
  render() {
    let errors = [...this.props.errors, this.state.errors];

  return (
    <NumberBox
      label={this.state.metadata.label}
      errors={errors}
      inline={this.props.inline}
        id={this.props.id}
        className={ errors.length ? "form-control is-invalid" : "form-control" }
        onChange={this.props.onChange}
        value={this.props.value}
        required={this.state.metadata.required}
        min={this.state.metadata.min}
      />
  );
}
}