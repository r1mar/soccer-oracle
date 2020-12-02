import React from "react";
import Form from "./Form";
import NotFoundError from "./NotFoundError";
import RapidTextBox from "./RapidTextBox";
import service from "./Service";

export default class RapidForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {},
      errors: [],
      metadata: {
        form: []
      }
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  async componentDidMount() {
    try {
      if (this.props.operation != "create") {
        let value = await service.readEntity(this.props.value);
        this.setState({
          value: value
        });
      }

      this.setState({
        metadata: await service.readMetadata(this.props.meta)
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        this.props.history.push(this.props.notFound);
      } else {
        this.setState({
          errors: [e]
        });
      }
    }
  }

  async onSubmit(event) {
    try {
      event.preventDefault();

      if (this.props.operation === "create") {
        let value = await service.createEntity(
          this.props.value,
          this.state.value
        );

        this.props.history.replace(value["$path"]);
      } else {
        await service.updateEntity(this.props.value, this.state.value);
      }
    } catch (e) {
      this.setState({
        errors: [e]
      });
    }
  }

  getValue(path, obj) {
    let parts = path.split("/");

    parts = parts.filter(part => part);

    if (parts.length > 1) {
      obj = obj[parts[0]];
      path = path.replace(parts[0] + "/", "");
      return this.getValue(path, obj);
    } else {
      return obj[parts[0]];
    }
  }

  setValue(path, obj, value) {
    let parts = path.split("/");

    parts = parts.filter(part => part);

    if (parts.length > 1) {
      let subObj = obj[parts[0]],
        subPath = path.replace(parts[0] + "/", "");

      this.setValue(subPath, subObj, value);

      return obj;
    } else {
      obj[parts[0]] = value;

      return obj;
    }
  }

  onChange(event, item) {
    let value = JSON.parse(JSON.stringify(this.state.value));

    this.setValue(event.target.id, value, event.target.value);

    this.setState({
      value: Object.assign({}, this.state.value, value)
    });
  }

  render() {
    let children = this.state.metadata.form.map(property => {
      switch (property.type) {
        case "TextBox":
          return (
            <RapidTextBox
              id={property.path}
              key={property.path}
              value={this.getValue(property.path, this.state.value)}
              onChange={this.onChange}
              errors={this.state.errors.filter(
                error => error.path === property.path
              )}
              meta={property.meta}
            />
          );
      }
    });

    return (
      <Form onSubmit={this.onSubmit} errors={this.state.errors}>
        {children}
      </Form>
    );
  }
}
