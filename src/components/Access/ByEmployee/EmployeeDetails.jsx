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
import TemplateModal from "../../common/Modal/TemplateModal";
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
import { GetTemplateById, ShareApp } from "../../services/newEmployee.services";
import { GetEmployeeByMail } from "../../services/setup.service";
import { ShareTemplateNotification } from "../../common/Notifications/ShareNotifications";
import moment from "moment";

const { Search } = Input;
const { Content } = Layout;
const { Option } = Select;

const EmployeeDetails = () => {
  const { empId } = useParams();
  const [items, setItems] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const [modal, setModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [confirmBtnLoader, setConfirmBtnLoader] = useState(false);
  const [recommendedLoader, setRecommendedLoader] = useState(false);
  const [apps, setApps] = useState([]);
  const [resultArray, setResultArray] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [Checked, setChecked] = useState(false);
  const [templateApplications, setTemplateApplications] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [value, setValue] = useState();
  const [tableValues, setTableValues] = useState([]);
  const [form] = Form.useForm();
  const [searchApps, setSearchApps] = useState();
  const dateFormatList = ["MM/DD/YYYY", "MM/DD/YY"];

  const searchFilter = (searchText) => {
    if (searchText != "") {
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

  const getTemplateById = async () => {
    setPageLoader(true);
    templateApplications.splice(0, templateApplications.length);
    try {
      let response = await GetTemplateById(empId);
      response = await response.json();
      if (response.Result[0].applications.length > 0) {
        setTemplateName(response.Result[0].name);
        setTemplateApplications(response.Result[0].applications);
      } else setTemplateApplications("");
      getAllApps(response.Result[0].applications);
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
    getTemplateById();
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
    console.log(resultArray);
    setTemplateApplications(resultArray);
    setConfirmBtnLoader(false);
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    let applicationDetails = {
      empMail: tableData.map((val) => {
        return val.mail;
      }),
      applications: templateApplications.map((temp) => {
        return {
          appName: temp.name,
          status: "requested",
          requestedDate: "",
          approvedDate: "",
          grantedDate: "",
          revokedDate: "",
        };
      }),
    };
    try {
      let applicationResponse = await ShareApp(applicationDetails);
      applicationResponse = await applicationResponse.json();
      ShareTemplateNotification();
      setConfirmBtnLoader(false);
      apps.map((appData) => {
        return (appData.checked = false);
      });
      setChecked(false);
      setTableData([]);
      setValue([]);
      setTableValues([]);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const openModal = async () => {
    setModal(true);
    setRecommendedLoader(true);
    setTimeout(() => {
      setRecommendedLoader(false);
    }, 1000);
  };

  const onRecommendedItemChecked = (item, e, mode) => {
    if (mode == "selectOne") {
      apps.map((appData) => {
        if (appData._id === item._id)
          return (appData.checked = e.target.checked);
      });
      const result = apps.filter((appData) => {
        return appData.checked == true;
      });
      resultArray.splice(0, resultArray.length);
      resultArray.push(...result);
      if (result.length > 0) setDisabled(false);
      else setDisabled(true);
    }
  };

  const handleSubmitRecommendedApplications = () => {
    console.log(resultArray);
    setTemplateApplications(resultArray);
    setModal(false);
  };

  const handleCrossDelete = (e, app) => {
    let resultingTemplateApps = templateApplications.filter(
      (temApp) => temApp._id != app._id
    );
    setResultArray(resultingTemplateApps);
    setTemplateApplications(resultingTemplateApps);
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

  const handleSetValue = (values) => {
    console.log(values);
    setValue(values);
    values.map((val) => {
      var item = tableValues.find((item) => item.value === val.value);
      if (item == undefined) {
        tableValues.push(val);
      }
    });
  };
  let empDetails = {
    name: "",
    mail: "",
    status: "",
    type: "",
    role: "",
    startDate: "",
  };

  return (
    <div>
      <section className="newEmployee h-100">
        <div className="pl-3 my-4 mb-4">
          {pageLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
              <div className="loaderText mt-2">Fetching Employee Details</div>
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
                          to={"/itaccess/access/by-employee"}
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
                          {templateName}
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
                                  className="form-control"
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
                                  Email
                                </label>
                                <Input
                                  size="large"
                                  className="form-control"
                                  id="email"
                                  value={empDetails.mail}
                                  disabled={true}
                                />
                              </div>
                              <div className="d-flex form-group col-md-4">
                                <label
                                  htmlFor="status"
                                  className="w-50 fontsize"
                                  style={{ fontWeight: "600" }}
                                >
                                  Status
                                </label>
                                <Input
                                  size="large"
                                  className="form-control"
                                  id="status"
                                  value={empDetails.status}
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
                                  Role
                                </label>
                                <Select
                                  value={empDetails.role}
                                  disabled={disabled}
                                  className="w-100"
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
                              <div className="form-group col-md-4 d-flex">
                                <label
                                  htmlFor="startDate"
                                  className="w-50 fontsize"
                                  style={{ fontWeight: "600" }}
                                >
                                  Start Date
                                </label>
                                <DatePicker
                                  defaultValue={moment(
                                    empDetails.startDate,
                                    dateFormatList[0]
                                  )}
                                  format={dateFormatList}
                                  disabled={true}
                                  className="w-100"
                                />
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
                            <div className="mr-5">
                              <Button
                                type="primary"
                                className="float-right"
                                onClick={openModal}
                                style={{ width: "7%" }}
                              >
                                Revoke
                              </Button>
                            </div>
                            <div className="float-left mt-4 ml-4">
                              {templateApplications.map((app) => (
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
                          <div className="mt-4">
                            <hr className="hrStyles" />
                            <div className="mainTitle">Requested</div>
                          </div>
                          <div className="mt-4">
                            <hr className="hrStyles" />
                            <div className="mainTitle">Revoked/Declined</div>
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
                    <TemplateModal
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

export default EmployeeDetails;
