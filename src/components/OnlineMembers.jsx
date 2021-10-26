import React from "react";

export default function OnlineMembers(props) {
  return (
    <li className="online-members" style={{ color: props.usercolor }}>
      {props.username}
    </li>
  );
}
