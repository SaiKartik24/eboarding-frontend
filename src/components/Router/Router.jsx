import React, { Component } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "../Home/Home";
import LoginPage from "../Login/loginPage";
import Application from "../Setup/Application";
import Employee from "../Setup/Employee";
import Template from "../Setup/Template";

class Routing extends Component {
  render() {
    return (
      <Router>
        <div className="h-100">
          <Routes>
            <Route exact path="/" element={<LoginPage key={1} />} />
            <Route exact path="/itaccess" element={<Home key={2} />}>
              <Route exact path="/itaccess/employee" element={<Employee key={3} />} />
              <Route exact path="/itaccess/application" element={<Application key={4} />} />
              <Route exact path="/itaccess/template" element={<Template key={5} />} />
            </Route>
          </Routes>
        </div>
      </Router>
    );
  }
}

export default Routing;
