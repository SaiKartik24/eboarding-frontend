import React, { useEffect, useState } from "react";
import "./loginPage.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Radio } from "antd";
import { Button, Input, Form } from "antd";
import LoginNotification from "../common/Notifications/LoginNotification";
import { GetAdmin } from "../services/login.service";

const Login = () => {
  let navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validName, setValidName] = useState(true);
  const [validPass, setValidPass] = useState(true);
  const [adminData, setAdminData] = useState([]);
  const handleInput = (e) => {
    let val = e.target.value;
    if (val.length === 0) {
      setValidName(false);
      setUserName(val);
      setShowError(false);
    } else {
      setValidName(true);
      setUserName(val);
      setShowError(false);
    }
  };
  const handlePass = (e) => {
    let val = e.target.value;
    if (val.length <= 0) {
      setValidPass(false);
      setPassword(val);
      setShowError(false);
    } else {
      setValidPass(true);
      setPassword(e.target.value);
      setShowError(false);
    }
  };

  // onKeyDown handler function
  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      if (username !== "" && password !== "") {
        loginHandler();
      } else if (username === "") {
        setValidName(false);
      } else {
        setValidPass(false);
      }
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const getAdmin = async() => {
    try {
      let response = await GetAdmin();
      response = await response.json();
      setAdminData(response.Result);
      console.log(response);
    } catch (error) {
      console.log("Error", error);
    }
  }

  const storeData = (userDetails) =>{
    let userData = JSON.stringify(userDetails);
    localStorage.setItem("userData", userData);
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  }

  const [loginBtnLoader, setLoginBtnLoader] = useState(false);
  const [showError, setShowError] = useState(false);
  const loginHandler = () => {
    // e.preventDefault();
    if (username !== "" && password !== "") {
      setLoginBtnLoader(true);
      if (username == "admin" && password == "admin@123") {
        let userDetails = {
          id: "",
          password: "",
          fullname: "Admin",
          mail: "p1@abc.com",
          employmenttype: "Full Time",
          role: "Administrator",
          managermail: "m1@abc.com",
          managerid: "",
          startdate: "",
          enddate: "",
          status: "Active"
        };
        storeData(userDetails);
      }
      else if (username == "user" && password == "user@123")
      { 
        let userDetails = {
          id: "",
          password: "",
          fullname: "User",
          mail: "p1@abc.com",
          employmenttype: "Full Time",
          role: "Team Member",
          managermail: "m1@abc.com",
          managerid: "",
          startdate: "01/01/2020",
          enddate: "01/01/2021",
          status: "Active"
        };
        storeData(userDetails);
      } else {
        LoginNotification();
        setTimeout(() => {
          setLoginBtnLoader(false);
        }, 3000);
      }
    } else if (username === "" && password !== "") setValidName(false);
    else if (password === "" && username !== "") setValidPass(false);
    else {
      setValidName(false);
      setValidPass(false);
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <section className="loginPage-section">
      <div className="mt-0 overflow-hidden">
        <main className="ml-auto mr-auto min-vh-100 d-flex pl-0 pr-0 w-100 mh-100">
          <div className="w-100 d-flex align-items-center bg">
            <div className="row ml-auto mr-auto w-100 t-3">
              <div className="col-lg-7 mx-auto">
                <div className="container" id="container">
                  <div className="form-container sign-in-container">
                    <div className="titleSty">Login</div>
                    <div className="mt-4 txt">
                      Welcome back, please put your login credentials below to
                      start using the app
                    </div>
                    <Form
                      id="login"
                      className="loginTStyle position-relative"
                      
                    >
                      <Form.Item
                        name="username"
                        className="mt-5 mb-5 topmargin"
                      >
                        <div
                          className={
                            validName
                              ? "d-flex mcp-light-gray bord"
                              : "invalid d-flex mcp-light-gray bord"
                          }
                        >
                          <Input
                            className="form-control form-rm"
                            placeholder="Username"
                            value={username}
                            onChange={handleInput}
                            onKeyDown={keyDownHandler}
                          />
                          <i className="fas fa-user icon-sty mt-3"></i>
                        </div>
                        <div
                          className={
                            validName
                              ? ""
                              : "ml-0 mb-0 mcp-white position-absolute error"
                          }
                        >
                          {validName ? null : "Username is required!"}
                        </div>
                      </Form.Item>
                      <Form.Item name="password" className="mt-4 mb-5">
                        <div
                          className={
                            validPass
                              ? "d-flex mcp-light-gray bord"
                              : "invalid d-flex mcp-light-gray bord"
                          }
                        >
                          <Input
                            type={passwordShown ? "text" : "password"}
                            className="form-control form-rm"
                            id="floatingPassword2"
                            placeholder="Password"
                            value={password}
                            onChange={handlePass}
                            onKeyDown={keyDownHandler}
                          />
                          {passwordShown ? (
                            <i
                              className="fas fa-eye-slash password icon-sty mt-3"
                              onClick={togglePassword}
                            ></i>
                          ) : (
                            <i
                              className="fas fa-eye icon-sty password mt-3"
                              onClick={togglePassword}
                            ></i>
                          )}
                        </div>
                        <div
                          className={
                            validPass
                              ? ""
                              : "ml-0 mb-0 mcp-white position-absolute error"
                          }
                        >
                          {validPass ? null : "Password is required!"}
                        </div>
                      </Form.Item>
                      <Form.Item name="button" className="mb-0">
                        <Button
                          type="primary"
                          className="w-100 mw-100 btn-lg mt-4 form-btn mb-4"
                          // disabled={true}
                          onClick={loginHandler}
                        >
                          {loginBtnLoader ? (
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                          ) : null}
                          Login
                        </Button>
                      </Form.Item>
                      <Form.Item name="forgot" className="mb-0">
                        <a href="/">forgot password?</a>
                      </Form.Item>
                    </Form>
                  </div>
                  <div className="overlay-container">
                    <div className="overlay h-100">
                      <div className="overlay-panel overlay-right">
                        <ul className="image-text mcp-white ul-text list-unstyled text-right">
                          <li>Welcome to</li>
                          <li className="lstTitle">
                            <b>IT Access</b>
                          </li>
                        </ul>
                        <img
                          className="mt-5 mlogoImage"
                          src={
                            process.env.PUBLIC_URL +
                            "assets/login/IT-Access.png"
                          }
                          alt="Logo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Login;
