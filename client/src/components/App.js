import React from "react";
import { Switch, Route } from "react-router-dom";
import LoginPage from "./views/LoginPage/LoginPage";
import LandingPage from "./views/LandingPage/LandingPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import NavBar from "./views/NavBar/NavBar";
import Auth from "../hoc/auth";
import Footer from "./views/Footer/Footer";
import GroupChatPage from "./views/ChatPage/GroupChatPage/GroupChatPage";
import CallChatPage from "./views/ChatPage/CallChatPage/CallChatPage";
import RandomChatPage from "./views/ChatPage/RandomChatPage/RandomChatPage";

function App() {
  return (
    <div>
      <NavBar />
      <div style={{ minHeight: "calc(100vh - 80px)" }}>
        <Switch>
          <Route path="/" exact component={Auth(LandingPage, null)} />
          <Route path="/login" exact component={Auth(LoginPage, false)} />
          <Route path="/register" exact component={Auth(RegisterPage, false)} />
          <Route
            path="/groupChat"
            exact
            component={Auth(GroupChatPage, true)}
          />
          <Route path="/callChat" exact component={Auth(CallChatPage, true)} />
          <Route
            path="/randomChat"
            exact
            component={Auth(RandomChatPage, true)}
          />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
