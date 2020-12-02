import React from "react";
import FieldError from "./FieldError";
import MultipleError from "./MultipleError";

export default function Alert(props) {
  let messages,
    counter = 0;

  try {
    messages = props.messages
      .filter(field => !(field instanceof FieldError))
      .map(all =>
        all instanceof MultipleError ? (
          all.errors.map(multi => (
            <div key={++counter} className="alert alert-danger">
              {multi.message}
            </div>
          ))
        ) : (
          <div key={++counter} className="alert alert-danger">
            {all.message}
          </div>
        )
      );
  } catch (e) {
    messages = <div className="alert alert-danger">{e.message}</div>;
  }
  return <div>{messages}</div>;
}
