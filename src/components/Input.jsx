import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, InputGroup, FormControl } from "react-bootstrap";

var Filter = require("bad-words"),
  filter = new Filter();

export default function Input(props) {
  const [state, setState] = useState({ text: "" });

  const onChange = (event) => {
    setState({ text: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();
    setState({ text: "" });
    props.onSendMessage(filter.clean(state.text));
  };

  return (
    <div className="Input">
      <form onSubmit={(event) => onSubmit(event)}>
        <InputGroup className="mb-3">
          <FormControl
            onChange={(event) => onChange(event)}
            value={state.text}
            type="text"
            placeholder="Type your message here"
            autoFocus={true}
          />
          <Button variant="info" type="submit">
            Send
          </Button>
        </InputGroup>
      </form>
    </div>
  );
}
