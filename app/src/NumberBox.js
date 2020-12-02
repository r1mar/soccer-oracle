import React from "react";
import FormGroup from "./FormGroup";

export default function NumberBox(props) {
  return (
    <FormGroup
      forId={props.id}
      label={props.label}
      errors={props.errors}
      inline={props.inline}
    >
      <input
        id={props.id}
        name={props.id}
        type="number"
        className="form-control"
        onChange={props.onChange}
        value={props.value}
        required={props.required}
        min={props.min}
      />
    </FormGroup>
  );
}
