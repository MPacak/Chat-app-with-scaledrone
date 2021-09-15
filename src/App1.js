//function component build

import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import Messages from "./components/Messages";
import Input from "./components/InputEm";
import { randomColor, randomName } from "./components/Name-Color";
import ErrorBoundary from "./components/ErrorBoundary";
import OnlineMembers from "./components/OnlineMembers";

function App() {
  const [messages, setMessages] = useState([]);
  const [member, setMember] = useState({
    username: randomName(),
    color: randomColor(),
  });
  const [members, setMembers] = useState([]);
  //const member = { ...member };
  const drone = new window.Scaledrone(`${process.env.REACT_APP_CHANNEL_ID}`, {
    data: member,
  });
  useEffect(() => {
    drone.on("open", (error) => {
      if (error) {
        throw new Error("Error");
      }

      member.id = drone.clientId;
      setMember(member);
    });
    const room = drone.subscribe("observable-room");

    room.on("open", (error) => {
      if (error) {
        throw new Error("Error");
      }
      console.log("Successfully joined room");
    });
    room.on("members", (members) => {
      setMembers(members);
      console.log(members);
    });
    room.on("member_join", (member) => {
      const memberList = members;
      memberList.push(member);
      setMembers(memberList);
    });
    room.on("member_leave", (member) => {
      const memberLeave = members.filter(
        (memberState) => memberState.id !== member.id
      );
      setMembers(memberLeave);
    });
    room.on("data", (data, member) => {
      const message = messages;
      const date = Date.now();

      const formatDate = (dateString) => {
        const options = {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      const dateString = formatDate(date);
      message.push({
        member,
        text: data,
        timestamp: dateString,
        id: member.id,
      });
      setMessages(message);
    });
  }, []);
  /*  scrolltoBottom = () => {
    messagesEnd.scrollIntoView({ behavior: "smooth" });
  }; */

  const onSendMessage = (message) => {
    drone.publish({
      room: "observable-room",
      message,
    });
    // scrolltoBottom();
  };
  return (
    <div className="App">
      <div className="App-header">
        <h1>My Chat App</h1>
      </div>
      <ErrorBoundary>
        <ul className="online-member-list list-unstyled border border-primary ">
          {members.length} users in the room
          {members.map((member) => {
            return (
              <OnlineMembers
                key={member.id}
                username={member.clientData.username}
                usercolor={member.clientData.color}
              />
            );
          })}
        </ul>
      </ErrorBoundary>
      <ErrorBoundary>
        <Messages messages={messages} currentMember={member} />
        {/*  <div
          style={{ clear: "both" }}
          ref={(el) => {
            messagesEnd = el;
          }}
        ></div> */}
      </ErrorBoundary>
      <ErrorBoundary>
        <Input onSendMessage={onSendMessage} />
      </ErrorBoundary>
    </div>
  );
}

export default App;
