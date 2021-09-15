//online members for fantom user

import React from "react";

export default function OnlineMembers(props) {
  return (
    <li className="online-members" style={{ color: props.usercolor }}>
      {props.number}
      {props.username}
    </li>
  );
}
