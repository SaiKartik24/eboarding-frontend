import React, { useState, useEffect } from "react";
import "../access.scss";
import {
  Button,
  Input,
  List,
  Layout,
  Empty,
  Form,
  Select,
  Tooltip,
  Table,
  Typography,
  DatePicker,
} from "antd";
import { debounce, indexOf } from "lodash";
import { SaveTemplateNotification } from "../../common/Notifications/SaveNotifications";
import { GetApplications } from "../../services/application.service";
import {
  AddTemplate,
  DeleteTemplate,
  GetTemplateByName,
  GetTemplates,
  UpdateTemplate,
} from "../../services/template.service";
import { applicationDeleteNotification } from "../../common/Notifications/DeleteNotifications";
import { recordUpdateNotification } from "../../common/Notifications/UpdateNotifications";
import { AddTemplateRequiredNotification } from "../../common/Notifications/RequiredNotification";
import { Link, useParams } from "react-router-dom";
import { GetEmployeeById, ShareApp } from "../../services/newEmployee.services";
import { GetEmployeeByMail } from "../../services/setup.service";
import { ShareTemplateNotification } from "../../common/Notifications/ShareNotifications";
import moment from "moment";
import EmployeeDetailsModal from "../../common/Modal/EmployeeDetailsModal";
import GrantRevokeModal from "../../common/Modal/GrantRevokeModal";
import { EmployeeApplicationAccess } from "../../services/byEmployee.service";
import {
  GetApplicationById,
  GetEmployeesByApplication,
} from "../../services/byApplication.service";

const { Search } = Input;
const { Content } = Layout;
const { Option } = Select;

const ApplicationDetails = () => {
  const { applicationId } = useParams();
  const [items, setItems] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const [modal, setModal] = useState(false);
  const [grantModal, setGrantModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [confirmBtnLoader, setConfirmBtnLoader] = useState(false);
  const [recommendedLoader, setRecommendedLoader] = useState(false);
  const [apps, setApps] = useState([]);
  const [resultArray, setResultArray] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [Checked, setChecked] = useState(false);
  const [employeeApplications, setEmployeeApplications] = useState([]);
  const [employeeGrantedApplications, setEmployeeGrantedApplications] =
    useState([]);
  const [employeeRequestedApplications, setEmployeeRequestedApplications] =
    useState([]);
  const [employeeRevokedApplications, setEmployeeRevokedApplications] =
    useState([]);
  const [tableData, setTableData] = useState([]);
  const [value, setValue] = useState();
  const [tableValues, setTableValues] = useState([]);
  const [form] = Form.useForm();
  const [searchApps, setSearchApps] = useState([]);
  const [searchGrantedApps, setSearchGrantedApps] = useState([]);
  const [searchRequestedApps, setSearchRequestedApps] = useState([]);
  const dateFormatList = ["MM/DD/YYYY", "MM/DD/YY"];
  const [requestActions, setRequestActions] = useState(["Grant", "Revoke"]);
  const [selectedAction, setSelectedAction] = useState("Grant");
  const [showAction, setShowAction] = useState(false);
  const [appId, setAppId] = useState("");
  const [applicationData, setApplicationData] = useState([]);

  const searchFilter = (searchText) => {
    if (searchText != "") {
      console.log(apps);
      let filteredApps = apps.filter((val) => {
        if (val.name.toLowerCase().includes(searchText.toLowerCase())) {
          console.log(val);
          return val;
        }
      });
      setSearchApps(filteredApps);
    } else {
      setSearchApps([]);
    }
  };

  const grantAppSearchFilter = (searchText) => {
    if (searchText != "") {
      let filteredApps = employeeGrantedApplications.filter((val) => {
        if (val.name.toLowerCase().includes(searchText.toLowerCase())) {
          console.log(val);
          return val;
        }
      });
      setSearchGrantedApps(filteredApps);
    } else {
      setSearchGrantedApps(employeeGrantedApplications);
    }
  };

  const requestAppSearchFilter = (searchText) => {
    if (searchText != "") {
      let filteredApps = employeeRequestedApplications.filter((val) => {
        if (val.name.toLowerCase().includes(searchText.toLowerCase())) {
          console.log(val);
          return val;
        }
      });
      setSearchRequestedApps(filteredApps);
    } else {
      setSearchRequestedApps(employeeGrantedApplications);
    }
  };

  const getEmployeesByApplication = async () => {
    setPageLoader(true);
    employeeGrantedApplications.splice(0, employeeGrantedApplications.length);
    employeeRequestedApplications.splice(
      0,
      employeeRequestedApplications.length
    );
    employeeRevokedApplications.splice(0, employeeRevokedApplications.length);
    employeeApplications.splice(0, employeeApplications.length);
    try {
      let response = await GetApplicationById(applicationId);
      response = await response.json();
      console.log(response);
      setPageLoader(false);
      setAppId(response.Result[0]._id);
      setApplicationData(response.Result[0]);
      //   if (response.Result[0].applications.length > 0) {
      //     try {
      //       let empResponse = await GetEmployeeById(response.Result[0]._id);
      //       empResponse = await empResponse.json();
      //       setEmployeeDetails(empResponse.Result[0]);
      //     } catch (error) {
      //       console.log("Error", error);
      //     }
      //     setEmployeeApplications(response.Result[0].applications);
      //     response.Result[0].applications.map((app) => {
      //       if (app.requestState) {
      //         employeeRequestedApplications.push(app);
      //         searchRequestedApps.push(app);
      //       } else if (app.grantState) {
      //         employeeGrantedApplications.push(app);
      //         searchGrantedApps.push(app);
      //       } else if (app.revokeState) {
      //         employeeRevokedApplications.push(app);
      //       } else {
      //         console.log("app", app);
      //       }
      //     });
      //   } else setEmployeeApplications("");
      //   getAllApps(response.Result[0].applications);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getAllApps = async (tempApps) => {
    apps.splice(0, apps.length);
    try {
      let applicationResponse = await GetApplications();
      applicationResponse = await applicationResponse.json();
      if (applicationResponse.Result.length > 0) {
        let res = applicationResponse.Result;
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < tempApps.length; j++) {
            if (res[i]._id === tempApps[j]._id) {
              res[i].checked = true;
              resultArray.push(res[i]);
            }
          }
        }
        setApps(res);
      } else setApps("");
      setTimeout(() => {
        setPageLoader(false);
      }, 1000);
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    getEmployeesByApplication();
  }, []);

  const save = async (record) => {
    try {
      let response = await UpdateTemplate(record, record._id);
      response = await response.json();
      recordUpdateNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setModal(false);
    setResultArray([]);
    setConfirmBtnLoader(false);
  };

  const handleCloseGrantModal = () => {
    setGrantModal(false);
    setResultArray([]);
  };

  const handleCloseRequestModal = () => {
    setRequestModal(false);
    setShowAction(false);
    setResultArray([]);
  };

  const ConfirmHandler = async (applicationDetails) => {
    try {
      let applicationResponse = await EmployeeApplicationAccess(
        applicationDetails,
        applicationDetails._id
      );
      applicationResponse = await applicationResponse.json();
      ShareTemplateNotification();
      setConfirmBtnLoader(false);
      setChecked(false);
      setTableData([]);
      setValue([]);
      setTableValues([]);
      getEmployeesByApplication();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const openModal = async () => {
    setModal(true);
    setRecommendedLoader(true);
    setResultArray([]);
    apps.map((appData) => {
      return (appData.checked = false);
    });
    setTimeout(() => {
      setRecommendedLoader(false);
    }, 1000);
  };

  const openGrantModal = async () => {
    setGrantModal(true);
    setRecommendedLoader(true);
    resultArray.splice(0, resultArray.length);
    employeeGrantedApplications.map((appData) => {
      return (appData.checked = false);
    });
    setTimeout(() => {
      setRecommendedLoader(false);
    }, 1000);
  };

  const openRequestModal = async () => {
    setRequestModal(true);
    setRecommendedLoader(true);
    resultArray.splice(0, resultArray.length);
    employeeRequestedApplications.map((appData) => {
      return (appData.checked = false);
    });
    setShowAction(true);
    setTimeout(() => {
      setRecommendedLoader(false);
    }, 1000);
  };

  const onRecommendedItemChecked = (item, e, mode) => {
    if (mode == "selectOne") {
      let res = apps.map((appData) => {
        if (appData._id === item._id) {
          appData.checked = e.target.checked;
        }
        return appData;
      });
      setApps(res);
      const result = apps.filter((appData) => {
        return appData.checked == true;
      });
      resultArray.splice(0, resultArray.length);
      resultArray.push(...result);
      if (result.length > 0) setDisabled(false);
      else setDisabled(true);
    }
  };

  const onGrantedItemChecked = (item, e, mode) => {
    if (mode == "selectOne") {
      employeeGrantedApplications.map((appData) => {
        if (appData._id === item._id)
          return (appData.checked = e.target.checked);
      });
      const result = employeeGrantedApplications.filter((appData) => {
        return appData.checked == true;
      });
      resultArray.splice(0, resultArray.length);
      resultArray.push(...result);
      if (result.length > 0) setDisabled(false);
      else setDisabled(true);
    }
  };

  const onRequestedItemChecked = (item, e, mode) => {
    if (mode == "selectOne") {
      employeeRequestedApplications.map((appData) => {
        if (appData._id === item._id)
          return (appData.checked = e.target.checked);
      });
      const result = employeeRequestedApplications.filter((appData) => {
        return appData.checked == true;
      });
      resultArray.splice(0, resultArray.length);
      resultArray.push(...result);
      if (result.length > 0) setDisabled(false);
      else setDisabled(true);
    }
  };

  const handleSubmitRecommendedApplications = () => {
    const res = resultArray.filter(
      (x) => !employeeApplications.some((y) => y._id === x._id)
    );
    let currentTimeSatamp = Date(Date.now().toString);
    let applicationDetails = {
      _id: appId,
      applications: res.map((app) => {
        return {
          _id: app._id,
          name: app.name,
          status: "requested",
          requestState: true,
          requestedDate: currentTimeSatamp,
          approveState: false,
          approvedDate: "",
          grantState: false,
          grantedDate: "",
          revokeState: false,
          revokedDate: "",
        };
      }),
    };
    console.log(applicationDetails);
    setModal(false);
    ConfirmHandler(applicationDetails);
    setModal(false);
  };

  const handleSubmitGrantApplications = () => {
    let currentTimeSatamp = Date(Date.now().toString);
    let applicationDetails = {
      _id: appId,
      applications: resultArray.map((app) => {
        return {
          _id: app._id,
          name: app.name,
          status: "revoked",
          requestState: false,
          requestedDate: app.requestedDate,
          approveState: false,
          approvedDate: "",
          grantState: false,
          grantedDate: app.grantedDate,
          revokeState: true,
          revokedDate: currentTimeSatamp,
        };
      }),
    };
    console.log(applicationDetails);
    setGrantModal(false);
    ConfirmHandler(applicationDetails);
    setModal(false);
  };

  const handleSubmitRequestApplications = () => {
    let currentTimeSatamp = Date(Date.now().toString);
    let applicationDetails = {
      _id: appId,
      applications: resultArray.map((app) => {
        return {
          _id: app._id,
          name: app.name,
          status: selectedAction != "Grant" ? "revoked" : "grant",
          requestState: false,
          requestedDate: app.requestedDate,
          approveState: false,
          approvedDate: "",
          grantState: selectedAction === "Grant" ? true : false,
          grantedDate:
            selectedAction === "Grant" ? currentTimeSatamp : app.grantedDate,
          revokeState: selectedAction != "Grant" ? true : false,
          revokedDate:
            selectedAction != "Grant" ? currentTimeSatamp : app.grantedDate,
        };
      }),
    };
    setRequestModal(false);
    setShowAction(false);
    console.log(applicationDetails);
    ConfirmHandler(applicationDetails);
    setModal(false);
  };

  const handleCrossDelete = (e, app) => {
    let resultingTemplateApps = employeeApplications.filter(
      (temApp) => temApp._id != app._id
    );
    setResultArray(resultingTemplateApps);
    setEmployeeApplications(resultingTemplateApps);
    let resultingApps = apps.map((appData) => {
      if (appData._id == app._id) {
        appData.checked = false;
      }
      return appData;
    });
    setApps(resultingApps);
  };

  const deleteFunc = (record) => {
    const res = tableData.filter((y) => {
      return y.mail != record.mail;
    });
    const tableRes = tableValues.filter((y) => {
      return y.value != record.mail;
    });
    setTableValues(tableRes);
    setTableData(res);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "mail",
    },
    {
      title: <b>Actions</b>,
      key: "action",
      render: (_, record) => {
        return (
          <div>
            <Typography.Link
              onClick={() => {
                deleteFunc(record);
              }}
            >
              <Tooltip title="Delete">
                <i
                  className="fas fa-trash ml-1 mr-1"
                  style={{ color: "red" }}
                ></i>
              </Tooltip>
            </Typography.Link>
          </div>
        );
      },
    },
  ];

  async function getUsers(email) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(mailformat)) {
      let userResponse = await GetEmployeeByMail(email);
      userResponse = await userResponse.json();
      let usersData = userResponse.Result.map((user) => ({
        label: user.username,
        value: user.mail,
      }));
      return usersData;
    }
  }
  var userEmails = [];
  const handleShare = async () => {
    tableValues.map((val) => {
      userEmails = [...userEmails, { username: val.label, mail: val.value }];
    });
    setTableData(userEmails);
    setValue([]);
  };

  let empDetails = {
    name: applicationData.name,
    teamMail: applicationData.teamMail,
    approverMail: applicationData.approverMail,
    type: applicationData.type,
    env: applicationData.env,
  };

  return (
    <div>
      <section className="newEmployee byEmployeeDetails h-100">
        <div className="pl-3 my-4 mb-4">
          {pageLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
              <div className="loaderText mt-2">
                Fetching Application Details
              </div>
            </div>
          ) : (
            <>
              <div className="container">
                <div className="content-tabs">
                  <div className="content  active-content">
                    <div>
                      <div className="d-flex mb-4">
                        <Link
                          className="mt-2 w text-decoration-none"
                          to={"/itaccess/access/by-application"}
                        >
                          <Tooltip
                            placement="leftTop"
                            title="Go Back"
                            arrowPointAtCenter
                          >
                            <span>
                              <span className="material-icons-outlined">
                                arrow_back
                              </span>
                            </span>
                          </Tooltip>
                        </Link>
                        <div className="ml-3 text-capitalize tname">
                          {applicationData.name}
                        </div>
                      </div>
                      <div
                        className="chooseStyEmp mb-4"
                        style={{ marginTop: "2rem" }}
                      >
                        <div className="mainTitle">Employee Information</div>
                        <div className="mb-4 mt-3">
                          <form>
                            <div className="d-flex">
                              <div className="d-flex form-group col-md-4">
                                <label
                                  htmlFor="name"
                                  className="fontsize w-50"
                                  style={{ fontWeight: "600" }}
                                >
                                  Name
                                </label>
                                <Input
                                  size="large"
                                  className="form-control profFont"
                                  id="name"
                                  value={empDetails.name}
                                  disabled={disabled}
                                />
                              </div>
                              <div className="d-flex form-group col-md-4">
                                <label
                                  htmlFor="email"
                                  className="w-50 fontsize"
                                  style={{ fontWeight: "600" }}
                                >
                                  Team Mail
                                </label>
                                <Input
                                  size="large"
                                  className="form-control profFont"
                                  id="email"
                                  value={empDetails.teamMail}
                                  disabled={true}
                                />
                              </div>
                              <div className="d-flex form-group col-md-4">
                                <label
                                  htmlFor="status"
                                  className="w-50 fontsize"
                                  style={{ fontWeight: "600" }}
                                >
                                  Approver Mail
                                </label>
                                <Input
                                  size="large"
                                  className="form-control profFont"
                                  id="status"
                                  value={empDetails.approverMail}
                                  disabled={true}
                                />
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="form-group col-md-4 d-flex">
                                <label
                                  htmlFor="type"
                                  className="w-50 fontsize"
                                  style={{ fontWeight: "600" }}
                                >
                                  Type
                                </label>
                                <Select
                                  placeholder="Please select Type"
                                  value={empDetails.type}
                                  disabled={disabled}
                                  className="w-100"
                                >
                                  <Option value="Hardware">Hardware</Option>
                                  <Option value="Software">Software</Option>
                                </Select>
                              </div>
                              <div className="form-group col-md-4 d-flex">
                                <label
                                  htmlFor="role"
                                  className="w-50 fontsize"
                                  style={{ fontWeight: "600" }}
                                >
                                  Env
                                </label>
                                <Select
                                  value={empDetails.env}
                                  disabled={disabled}
                                  className="w-100"
                                >
                                  <Option value="Dev">Dev</Option>
                                  <Option value="QA">QA</Option>
                                  <Option value="PROD">PROD</Option>
                                </Select>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="mt-5 empDetailsSty mb-4">
                        <div className="mainTitle">Applications</div>
                        <div className="row flex-column ml-auto mr-auto">
                          <div className="mr-5 mt-3 mb-1">
                            <Button
                              type="primary"
                              className="float-right"
                              onClick={openModal}
                              style={{ width: "7%" }}
                            >
                              Add
                            </Button>
                          </div>
                          <div className="mt-4">
                            <hr className="hrStyles" />
                            <div className="mainTitle">Granted</div>
                            <div className="float-left mt-4 ml-4">
                              {employeeGrantedApplications.map((app) => (
                                <Select
                                  className="selectStyle"
                                  mode="tags"
                                  value={app.name}
                                  open={false}
                                  bordered={false}
                                  onDeselect={(e) => handleCrossDelete(e, app)}
                                ></Select>
                              ))}
                            </div>
                            <div className="mr-5">
                              <Button
                                type="primary"
                                className="float-right"
                                onClick={openGrantModal}
                                style={{ width: "7%" }}
                              >
                                Revoke
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <hr className="hrStyles" />
                            <div className="mainTitle">Requested</div>
                            <div className="float-left mt-4 ml-4">
                              {employeeRequestedApplications.map((app) => (
                                <Select
                                  className="selectStyle"
                                  mode="tags"
                                  value={app.name}
                                  open={false}
                                  bordered={false}
                                  onDeselect={(e) => handleCrossDelete(e, app)}
                                ></Select>
                              ))}
                            </div>
                            <div className="mr-5">
                              <Button
                                type="primary"
                                className="float-right"
                                onClick={openRequestModal}
                                style={{ width: "7%" }}
                              >
                                Action
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4">
                            <hr className="hrStyles" />
                            <div className="mainTitle">Revoked/Declined</div>
                            <div className="float-left mt-4 ml-4">
                              {employeeRevokedApplications.map((app) => (
                                <Select
                                  className="selectStyle"
                                  mode="tags"
                                  value={app.name}
                                  open={false}
                                  bordered={false}
                                  onDeselect={(e) => handleCrossDelete(e, app)}
                                ></Select>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="float-right w-25 mr-5 mt-4">
                      <Button
                        type="primary"
                        className="float-right w-25"
                        onClick={ConfirmHandler}
                      >
                        {confirmBtnLoader ? (
                          <i className="fas fa-spinner fa-2x fa-spin spinner saveSpinner spinnerColor"></i>
                        ) : null}
                        Request
                      </Button>
                    </div> */}
                    <EmployeeDetailsModal
                      visibility={modal}
                      handleClose={handleClose}
                      apps={apps}
                      recommendedLoader={recommendedLoader}
                      onRecommendedItemChecked={onRecommendedItemChecked}
                      handleSubmitRecommendedApplications={
                        handleSubmitRecommendedApplications
                      }
                      searchApps={searchApps}
                      searchFilter={searchFilter}
                      Checked={Checked}
                    />
                    <GrantRevokeModal
                      visibility={grantModal}
                      title="Granted Applications"
                      handleClose={handleCloseGrantModal}
                      recommendedLoader={recommendedLoader}
                      onRecommendedItemChecked={onGrantedItemChecked}
                      handleSubmitRecommendedApplications={
                        handleSubmitGrantApplications
                      }
                      searchApps={searchGrantedApps}
                      searchFilter={grantAppSearchFilter}
                      Checked={Checked}
                      requestActions={requestActions}
                      showAction={showAction}
                    />
                    <GrantRevokeModal
                      visibility={requestModal}
                      title="Requested Applications"
                      handleClose={handleCloseRequestModal}
                      recommendedLoader={recommendedLoader}
                      onRecommendedItemChecked={onRequestedItemChecked}
                      handleSubmitRecommendedApplications={
                        handleSubmitRequestApplications
                      }
                      searchApps={searchRequestedApps}
                      searchFilter={requestAppSearchFilter}
                      Checked={Checked}
                      requestActions={requestActions}
                      showAction={showAction}
                      selectedAction={selectedAction}
                      setSelectedAction={setSelectedAction}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ApplicationDetails;
