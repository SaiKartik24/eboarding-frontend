import React, { useEffect, useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "./home.scss";
import TopBar from "../common/Topbar/Topbar";
import Sidebar from "../common/Sidebar/Sidebar";
import { Button, DatePicker, Input, Layout, Modal, Select } from "antd";
import { resolveUserData } from "../services/configs";
import moment from "moment";
import AddEmployeeRequiredNotification from "../common/Notifications/RequiredNotification";
import { UpdateEmployee } from "../services/setup.service";
import { ProfileUpdateNotification } from "../common/Notifications/UpdateNotifications";

const { Header, Content } = Layout;
const { Option } = Select;
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];

const Home = (props) => {
  const path = window.location.pathname.split("/");
  const appname = path[1];
  const nextname = path[2];
  const userData = resolveUserData();
  const [pageLoader, setPageLoader] = useState(false);
  const [appLoader, setAppLoader] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [id, setId] = useState(userData._id);
  const [fullName, setFullName] = useState(userData.fullname);
  const [userName, setUserName] = useState(userData.username);
  const [email, setEmail] = useState(userData.mail);
  const [password, setPassword] = useState(userData.password);
  const [empType, setEmpType] = useState(userData.employmenttype);
  const [empRole, setEmpRole] = useState(userData.role);
  const [managerMail, setManagerMail] = useState(userData.managermail);
  const [startDate, setStartDate] = useState(userData.startdate);
  const [endDate, setEndDate] = useState(userData.enddate);
  const [status, setStatus] = useState(userData.status);
  const [lastlogindate, setLastlogindate] = useState(userData.lastlogindate);
  const [confirmBtnLoader, setConfirmBtnLoader] = useState(false);

  useEffect(() => {
    appLoaderFunction();
    if (userData.lastlogindate == "") {
      setModal(true);
    }
  }, [location]);

  const appLoaderFunction = async () => {
    if (appname == "home" && nextname == undefined) {
      setAppLoader(true);
      setTimeout(() => {
        setAppLoader(false);
      }, 2000);
    }
  };
  const handleClose = (e) => {
    setModal(false);
    setStatus(userData.status);
    setEndDate(userData.enddate);
    setStartDate(userData.startdate);
    setManagerMail(userData.managermail);
    setEmpRole(userData.role);
    setEmpType(userData.employmenttype);
    setPassword(userData.password);
    setEmail(userData.mail);
    setFullName(userData.fullname);
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    if (
      password != "" &&
      fullName != "" &&
      email != "" &&
      managerMail != "" &&
      startDate != "" &&
      endDate != ""
    ) {
      let userDetails = {
        _id: id,
        password: password,
        fullname: fullName,
        username: userName,
        mail: email,
        employmenttype: empType,
        role: empRole,
        managermail: managerMail,
        managerid: "",
        startdate: startDate,
        enddate: endDate,
        status: status,
        lastlogindate: lastlogindate,
      };
      let userData = JSON.stringify(userDetails);
      localStorage.setItem("userData", userData);
      try {
        let response = await UpdateEmployee(userDetails, id);
        response = await response.json();
        setTimeout(() => {
          setConfirmBtnLoader(false);
          setModal(false);
          ProfileUpdateNotification();
        }, 2000);
      } catch (error) {
        console.log(error);
      }
    } else {
      AddEmployeeRequiredNotification();
      setConfirmBtnLoader(false);
    }
  };

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleChangeRole = (value) => {
    setEmpRole(value);
  };

  const handleChangeType = (value) => {
    setEmpType(value);
  };

  const handleChangeStatus = (value) => {
    setStatus(value);
  };

  const onChangeStartDate = (date, dateString) => {
    setStartDate(dateString);
    // console.log(date, dateString);
  };

  const onChangeEndDate = (date, dateString) => {
    setEndDate(dateString);
    // console.log(date, dateString);
  };

  return (
    <div className="home h-100">
      <Layout className="w-100" style={{ height: "100%", overflow: "hidden" }}>
        {/* <Sidebar apps={sidebarApps} /> */}
        <div className="d-flex flex-column w-100 h-100">
          <Header theme="light" className="header">
            <TopBar />
          </Header>
          {pageLoader ? (
            <div className="text-center pageLoaderSty">
              <i className="fas fa-spinner fa-2x fa-spin spinner"></i>
              <div className="loaderText mt-2">Loading</div>
            </div>
          ) : (
            <Layout
              style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
            >
              <Sidebar />
              <Layout>
                <div
                  style={{
                    padding: "0 24px 8px",
                  }}
                >
                  <div className="pl-3 mt-4">{/* <BreadCrumbs /> */}</div>
                </div>
                {appname === "home" && nextname === undefined ? (
                  appLoader ? (
                    <div className="text-center dashboardLoaderSty">
                      <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
                      <div className="loaderText mt-2">Loading Dashboard</div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="h-100"
                        style={{
                          padding: "0 100px 8px",
                        }}
                      >
                        <div className="appsBG h-100">
                          <div className="py-4 mx-4 h-100">
                            <div className="row h-50">
                              <div className="col-md-6 mt-4">
                                <div className="card bot-tile shadow-sm bot">
                                  <div
                                    className="d-flex mb-1"
                                    style={{
                                      position: "absolute",
                                      top: "2rem",
                                      right: "2rem",
                                    }}
                                  ></div>
                                  <div>Dashboard 1</div>
                                </div>
                              </div>
                              <div className="col-md-6 mt-4">
                                <div className="card bot-tile shadow-sm bot">
                                  <div
                                    className="d-flex mb-1"
                                    style={{
                                      position: "absolute",
                                      top: "2rem",
                                      right: "2rem",
                                    }}
                                  ></div>
                                  <div>Dashboard 2</div>
                                </div>
                              </div>
                            </div>
                            <div className="row h-50">
                              <div className="col-md-6 mt-4">
                                <div className="card bot-tile shadow-sm bot">
                                  <div
                                    className="d-flex mb-1"
                                    style={{
                                      position: "absolute",
                                      top: "2rem",
                                      right: "2rem",
                                    }}
                                  ></div>
                                  <div>Dashboard 3</div>
                                </div>
                              </div>
                              <div className="col-md-6 mt-4">
                                <div className="card bot-tile shadow-sm bot">
                                  <div
                                    className="d-flex mb-1"
                                    style={{
                                      position: "absolute",
                                      top: "2rem",
                                      right: "2rem",
                                    }}
                                  ></div>
                                  <div>Dashboard 4</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Modal
                            title={<b>Update Profile</b>}
                            visible={modal}
                            className="modalFont"
                            onCancel={handleClose}
                            footer={null}
                            keyboard={false}
                          >
                            <form>
                              <div className="d-flex">
                                <div className="form-group col-md-4">
                                  <label
                                    htmlFor="name"
                                    className="font-weight-bold fontsize"
                                  >
                                    Full Name
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <Input
                                    size="large"
                                    className="form-control"
                                    id="name"
                                    placeholder="Enter fullname"
                                    value={fullName}
                                    onChange={(e) => {
                                      if (e.target.value != "") {
                                        setFullName(e.target.value);
                                      } else {
                                        setFullName("");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="form-group col-md-4">
                                  <label
                                    htmlFor="email"
                                    className="font-weight-bold fontsize"
                                  >
                                    Email
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <Input
                                    size="large"
                                    className="form-control"
                                    id="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => {
                                      if (e.target.value != "") {
                                        setEmail(e.target.value);
                                      } else {
                                        setEmail("");
                                      }
                                    }}
                                  />
                                </div>
                                <div className="form-group col-md-4">
                                  <label
                                    htmlFor="password"
                                    className="font-weight-bold fontsize"
                                  >
                                    Password
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <div className="d-flex bord">
                                    <Input
                                      type={passwordShown ? "text" : "password"}
                                      size="large"
                                      className="form-control position-static"
                                      id="password"
                                      placeholder="Enter password"
                                      value={password}
                                      onChange={(e) => {
                                        if (e.target.value != "") {
                                          setPassword(e.target.value);
                                        } else {
                                          setPassword("");
                                        }
                                      }}
                                    />
                                    {passwordShown ? (
                                      <i
                                        className="fas fa-eye-slash password icon-sty"
                                        onClick={togglePassword}
                                      ></i>
                                    ) : (
                                      <i
                                        className="fas fa-eye icon-sty password"
                                        onClick={togglePassword}
                                      ></i>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="form-group col-md-4 d-flex flex-column">
                                  <label
                                    htmlFor="empType"
                                    className="font-weight-bold fontsize"
                                  >
                                    Employment Type
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <Select
                                    defaultValue={empType}
                                    onChange={handleChangeType}
                                  >
                                    <Option value="Full Time">Full Time</Option>
                                    <Option value="Contractor">
                                      Contractor
                                    </Option>
                                    <Option value="Vendor">Vendor</Option>
                                  </Select>
                                </div>
                                <div className="form-group col-md-4 d-flex flex-column">
                                  <label
                                    htmlFor="empRole"
                                    className="font-weight-bold fontsize"
                                  >
                                    Employment Role
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <Select
                                    defaultValue={empRole}
                                    onChange={handleChangeRole}
                                  >
                                    <Option value="Team Member">
                                      Team Member
                                    </Option>
                                    <Option value="Administrator">
                                      Administrator
                                    </Option>
                                    <Option value="Manager">Manager</Option>
                                  </Select>
                                </div>
                                <div className="form-group col-md-4">
                                  <label
                                    htmlFor="managerMail"
                                    className="font-weight-bold fontsize"
                                  >
                                    Manager Mail
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <Input
                                    size="large"
                                    className="form-control"
                                    id="managerMail"
                                    placeholder="Enter Manager Mail"
                                    value={managerMail}
                                    onChange={(e) => {
                                      if (e.target.value != "") {
                                        setManagerMail(e.target.value);
                                      } else {
                                        setManagerMail("");
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="form-group col-md-4 d-flex flex-column">
                                  <label
                                    htmlFor="startDate"
                                    className="font-weight-bold fontsize"
                                  >
                                    Start Date
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <DatePicker
                                    defaultValue={moment(
                                      startDate,
                                      dateFormatList[0]
                                    )}
                                    format={dateFormatList}
                                    onChange={onChangeStartDate}
                                  />
                                </div>
                                <div className="form-group col-md-4 d-flex flex-column">
                                  <label
                                    htmlFor="endDate"
                                    className="font-weight-bold fontsize"
                                  >
                                    End Date
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <DatePicker
                                    defaultValue={moment(
                                      endDate,
                                      dateFormatList[0]
                                    )}
                                    format={dateFormatList}
                                    onChange={onChangeEndDate}
                                  />
                                </div>
                                <div className="form-group col-md-4 d-flex flex-column">
                                  <label
                                    htmlFor="status"
                                    className="font-weight-bold fontsize"
                                  >
                                    Status
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <Select
                                    defaultValue={status}
                                    onChange={handleChangeStatus}
                                  >
                                    <Option value="Active">Active</Option>
                                    <Option value="Inactive">Inactive</Option>
                                  </Select>
                                </div>
                              </div>
                            </form>
                            <Button
                              style={{
                                left: "78%",
                                fontSize: "1rem",
                                height: "fit-content",
                                width: "118px",
                              }}
                              onClick={handleClose}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="primary"
                              className="float-right buttonStyle"
                              onClick={ConfirmHandler}
                              style={{
                                fontSize: "1rem",
                                height: "fit-content",
                                width: "118px",
                              }}
                            >
                              {confirmBtnLoader ? (
                                <i
                                  className="fas fa-spinner mr-2 fa-spin"
                                  style={{ fontSize: "0.9rem", color: "white" }}
                                ></i>
                              ) : null}
                              Confirm
                            </Button>
                          </Modal>
                        </div>
                      </div>
                      <div style={{ position: "sticky", top: "100%" }}>
                        {/* {tabLoader && apps.length == 0 ? null : <Footer />} */}
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <div
                      className="h-100"
                      style={{
                        padding: "0 24px 8px",
                      }}
                    >
                      <Content
                        className="site-layout-background"
                        style={{
                          margin: 0,
                          minHeight: 280,
                          height: "100%",
                        }}
                      >
                        <Outlet />
                      </Content>
                    </div>
                  </>
                )}
              </Layout>
            </Layout>
          )}
        </div>
      </Layout>
    </div>
  );
};
export default Home;
