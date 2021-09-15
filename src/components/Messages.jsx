import React from "react";

export default function Messages(props) {
  const renderMessage = (message) => {
    const { member, text, id, timestamp } = message;
    const { currentMember } = props;
    const messageFromMe = member.id === currentMember.id;

    const className = messageFromMe
      ? "Messages-message currentMember"
      : "Messages-message";

    return (
      <li className={className} key={id}>
        <span
          className="avatar"
          style={{ backgroundColor: member.clientData.color }}
        />
        <div className="Message-content">
          <div className="date">{timestamp}</div>
          <div className="username">{member.clientData.username}</div>
          <div className="text">{text}</div>
        </div>
      </li>
    );
  };

  return (
    <div className="message-container">
      <ul>{props.messages.map((m) => renderMessage(m))}</ul>
    </div>
  );
}
