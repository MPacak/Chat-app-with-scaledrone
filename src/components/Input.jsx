import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import Bullseye from "../assets/bullseye.svg";

import InputEmoji from "react-input-emoji";

export default function Input(props) {
  const [state, setState] = useState("");

  function handleOnEnter(state) {
    setState("");
    props.onSendMessage(state);
  }
  const onSubmit = (event) => {
    event.preventDefault();
    setState("");
    props.onSendMessage(state);
  };
  return (
    <div className="Input">
      <form onSubmit={(event) => onSubmit(event)}>
        <InputEmoji
          value={state}
          onChange={setState}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
          className="input-emoji "
        />
        <Button
          className=" rounded-pill btn-outline-info btn-outline-opacity-25 btn-sm btn-secondary "
          type="submit"
        >
          <img src={Bullseye} alt="Send" width="20" height="20" />
        </Button>
      </form>
    </div>
  );
}
