import React from "react";
import FormGroup from "./FormGroup";

export default function TextBox(props) {
  return (
    <FormGroup forId={props.id} label={props.label} errors={props.errors}>
      <input
        id={props.id}
        name={props.id}
        type="text"
        className="form-control"
        onChange={props.onChange}
        value={props.value}
        required={props.required}
      />
    </FormGroup>
  );
}
