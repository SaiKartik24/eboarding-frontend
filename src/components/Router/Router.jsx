import React, { Component } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppDetails from "../AppDetails/appDetails";
import Home from "../Home/Home";
import LoginPage from "../Login/loginPage";

class Routing extends Component {
  render() {
    return (
      <Router>
        <div className="h-100">
          <Routes>
            <Route exact path="/" element={<LoginPage key={1} />} />
            <Route exact path="/home" element={<Home key={2} />}>
              <Route exact path="/home/setup" element={<AppDetails key={3} />} />
            </Route>
          </Routes>
        </div>
      </Router>
    );
  }
}

export default Routing;
