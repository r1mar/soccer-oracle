import React from "react";

export default function Alert(props) {
  let messages,
    counter = 0;

  try {
    messages = props.messages
      .filter(error => !error.field )
      .map(all =>
        all.errors ? (
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
