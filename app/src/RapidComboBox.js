import React from "react";
import service from "./Service";
import ComboBox from "./ComboBox";

export default class RapidComboBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [],
      errors: [],
      metadata: {},
      valid: props.errors.length === 0
    };

    this.mapOptions = this.mapOptions.bind(this);
  }

  async componentDidMount() {
    try {
      if (this.props.meta) {
        let metadata = await service.readMetadata(this.props.meta);

        this.setState({
          options: await service.readEntities(metadata.valueList.path),
          metadata: metadata,
          errors: this.props.errors ?? []
        });
      }
    } catch (e) {
      this.setState({
        errors: [e],
        valid: false
      });
    }
  }

  mapOptions(optionInput) {
    let id = optionInput[this.state.metadata.valueList.id],
      value = optionInput[this.state.metadata.valueList.value];

    return {
      id: id,
      value: value
    };
  }

  onChange(event) {
    this.props.onChange(
      event,
      this.state.options.find(
        option => this.mapOptions(option).value === event.target.value
      )
    );
  }

  render() {
    return (
      <ComboBox
        id={this.props.id}
        label={this.state.metadata.label}
        onChange={this.props.onChange}
        options={this.state.options.map(this.mapOptions)}
        value={this.props.value}
        required={this.state.metadata.required}
        errors={this.state.errors}
        valid={this.state.valid}
      />
    );
  }
}
