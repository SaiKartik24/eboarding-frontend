import React, { Component } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NewEmployee from "../Access/NewEmployee/NewEmployee";
import ShareApplications from "../Access/NewEmployee/ShareApplications";
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
              <Route
                exact
                path="/itaccess/access/new-employee"
                element={<NewEmployee key={3} />}
              >
                <Route
                  exact
                  path=":templateId"
                  element={<ShareApplications key={4} />}
                />
              </Route>
              <Route
                exact
                path="/itaccess/access/by-employee"
                element={<Application key={5} />}
              />
              <Route
                exact
                path="/itaccess/access/by-application"
                element={<Template key={6} />}
              />
              <Route
                exact
                path="/itaccess/setup/employee"
                element={<Employee key={7} />}
              />
              <Route
                exact
                path="/itaccess/setup/application"
                element={<Application key={8} />}
              />
              <Route
                exact
                path="/itaccess/setup/template"
                element={<Template key={9} />}
              />
            </Route>
          </Routes>
        </div>
      </Router>
    );
  }
}

export default Routing;
