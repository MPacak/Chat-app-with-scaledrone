import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import Messages from "./components/Messages";
import Input from "./components/InputEm";
import { randomColor } from "./helpers/randomColor";
import { randomName } from "./helpers/randomName";
import ErrorBoundary from "./components/ErrorBoundary";
import OnlineMembers from "./components/OnlineMembers";

class App extends Component {
  state = {
    messages: [],
    members: [],
    member: {
      username: randomName(),
      color: randomColor(),
    },
  };

  scrolltoBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };
  componentDidMount() {
    this.drone = new window.Scaledrone(`${process.env.REACT_APP_CHANNEL_ID}`, {
      data: this.state.member,
    });
    this.drone.on("open", (error) => {
      if (error) {
        throw new Error("Error");
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });
    const room = this.drone.subscribe("observable-room");
    room.on("open", (error) => {
      if (error) {
        throw new Error("Error");
      }
      alert("Welcome to the Chat app!");
    });
    room.on("members", (members) => {
      this.setState({ members });
    });
    room.on("member_join", (member) => {
      const memberList = this.state.members;
      memberList.push(member);
      this.setState({ members: memberList });
    });
    room.on("member_leave", (member) => {
      const memberLeave = this.state.members.filter(
        (memberState) => memberState.id !== member.id
      );
      this.setState({ members: memberLeave });
    });
    room.on("data", (data, member) => {
      const messages = this.state.messages;
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

      messages.push({
        member,
        text: data,
        timestamp: dateString,
        id: this.state.messages.length,
        //id: member.id,
      });
      this.setState({ messages });
    });
  }
  componentDidUpdate() {
    this.scrolltoBottom();
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };

  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <div className="App-header">Chat app</div>
          </Row>
          <Row>
            <Col
              xs={4}
              sm={4}
              md={4}
              lg={4}
              className="bg-primary bg-opacity-75 border border-primary "
            >
              <ErrorBoundary>
                <ul className="online-member-list list-unstyled position-fixed">
                  {this.state.members.length} users in the room
                  {this.state.members.map((member) => {
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
            </Col>
            <Col
              xs={8}
              sm={8}
              md={8}
              lg={8}
              className="bg-secondary bg-opacity-75 "
            >
              <ErrorBoundary>
                <Messages
                  messages={this.state.messages}
                  currentMember={this.state.member}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <Input onSendMessage={this.onSendMessage} />
              </ErrorBoundary>
              <div
                ref={(el) => {
                  this.messagesEnd = el;
                }}
              ></div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
