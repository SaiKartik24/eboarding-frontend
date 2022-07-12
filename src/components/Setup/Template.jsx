import React, { useState, useEffect } from "react";
import "./setup.scss";
import { Button, Input, List, Layout, Empty, Form, Select } from "antd";
import { debounce } from "lodash";
import { AddApplicationRequiredNotification } from "../common/Notifications/RequiredNotification";
import { recordUpdateNotification } from "../common/Notifications/UpdateNotifications";
import { applicationDeleteNotification } from "../common/Notifications/DeleteNotifications";
import {
  AddTemplate,
  DeleteTemplate,
  GetTemplateByName,
  GetTemplates,
  UpdateTemplate,
} from "../services/template.service";
import TemplateModal from "../common/Modal/TemplateModal";
import {
  GetApplicationByName,
  GetApplications,
} from "../services/application.service";

const { Search } = Input;

const { Content } = Layout;

const Template = () => {
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
  const [form] = Form.useForm();

  const getAllTemplates = async () => {
    setPageLoader(true);
    items.splice(0, items.length);
    try {
      let response = await GetTemplates();
      response = await response.json();
      if (response.Result.length > 0) {
        setItems(response.Result);
      } else setItems("");
      getAllApps();
    } catch (error) {
      console.log("Error", error);
    }
  };

  const getAllApps = async () => {
    apps.splice(0, apps.length);
    try {
      let applicationResponse = await GetApplications();
      applicationResponse = await applicationResponse.json();
      if (applicationResponse.Result.length > 0) {
        console.log(applicationResponse.Result);
        setApps(applicationResponse.Result);
      } else setApps("");
      setTimeout(() => {
        setPageLoader(false);
      }, 1000);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const searchTemplate = debounce(async (e) => {
    let val = e.target.value;
    try {
      let response = await GetTemplateByName(val);
      response = await response.json();
      if (response.Result && response.Result.length > 0)
        setItems(response.Result);
      else setItems("");
    } catch (error) {
      console.log("Error", error);
    }
  }, 500);

  useEffect(() => {
    getAllTemplates();
  }, []);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const save = async (record) => {
    try {
      let response = await UpdateTemplate(record, record._id);
      response = await response.json();
      recordUpdateNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFunc = async (record) => {
    try {
      let response = await DeleteTemplate(record, record._id);
      response = await response.json();
      // getAllTemplates();
      let idToRemove = record._id;
      let myArr = items.filter(function (item) {
        return item._id != idToRemove;
      });
      setItems(myArr);
      applicationDeleteNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setModal(false);
    setTemplateApplications(resultArray);
    // setChecked(false);
    // setDisabled(true);
    // resultArray.splice(0, items.length);
    // apps.splice(0, items.length);
    setConfirmBtnLoader(false);
    // apps.map((appData) => {
    //   return (appData.checked = false);
    // });
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    if (templateName != "") {
      let applicationDetails = {
        templateName: templateName,
      };
      try {
        let applicationResponse = await AddTemplate(applicationDetails);
        applicationResponse = await applicationResponse.json();
        getAllTemplates();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (templateName != "") {
      let applicationDetails = {
        templateName: templateName,
      };
      try {
        let applicationResponse = await AddTemplate(applicationDetails);
        applicationResponse = await applicationResponse.json();
        //   getAllTemplates();
      } catch (error) {
        console.log("Error", error);
      }
      try {
        let response = await AddTemplate();
        response = await response.json();
        getAllTemplates();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (templateName == "") {
      try {
        let response = await AddTemplate();
        response = await response.json();
        getAllTemplates();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      AddApplicationRequiredNotification();
      setConfirmBtnLoader(false);
    }
  };

  const openModal = async () => {
    setModal(true);
    setRecommendedLoader(true);
    setTimeout(() => {
      setRecommendedLoader(false);
    }, 1000);
  };

  const searchApplication = debounce(async (e) => {
    let val = e.target.value;
    try {
      let applicationResponse = await GetApplicationByName(val);
      applicationResponse = await applicationResponse.json();
      if (applicationResponse.Result && applicationResponse.Result.length > 0)
        setApps(applicationResponse.Result);
      else setApps("");
    } catch (error) {
      console.log("Error", error);
    }
  }, 500);

  const onRecommendedItemChecked = (item, e, mode) => {
    if (mode == "selectOne") {
      apps.map((appData) => {
        if (appData._id === item._id)
          return (appData.checked = e.target.checked);
      });
      const result = apps.filter((appData) => {
        return appData.checked == true;
      });
      setResultArray(result);
      if (result.length > 0) setDisabled(false);
      else setDisabled(true);
    } else if (mode == "selectAll") {
      let check = e.target.checked;
      apps.map((appData) => {
        return (appData.checked = check);
      });
      const result = apps.filter((appData) => {
        return appData.checked == true;
      });
      setResultArray(result);
      setChecked(check);
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
    setTemplateApplications(resultingTemplateApps);
    let resultingApps = apps.map((appData) => {
      if (appData._id == app._id) {
        appData.checked = false;
      }
      return appData;
    });
    setApps(resultingApps);
    console.log(resultingApps);
  };

  return (
    <div>
      <section className="application h-100">
        <div className="pl-3 my-4 mb-4">
          {pageLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
              <div className="loaderText mt-2">Fetching Templates</div>
            </div>
          ) : (
            <>
              <div className="container">
                <div className="bloc-tabs">
                  <button
                    className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(1)}
                  >
                    Search
                  </button>
                  <button
                    className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(2)}
                  >
                    Add
                  </button>
                </div>

                <div className="content-tabs">
                  <div
                    className={
                      toggleState === 1
                        ? "content  active-content d-flex flex-column"
                        : "content"
                    }
                  >
                    <div className="">
                      <div className="d-flex float-right mb-4 w-25">
                        <Search
                          allowClear
                          size="large"
                          onChange={(e) => searchTemplate(e)}
                          placeholder="Search for template"
                          className="mr-3"
                        />
                      </div>
                    </div>
                    <div className="card">
                      <div className="my-3 px-4">
                        <div className="row">
                          <div className="col-sm">
                            <div className="applicationData">
                              {items.length > 0 ? (
                                <List
                                  itemLayout="horizontal"
                                  dataSource={items}
                                  className={
                                    items.length == 0
                                      ? "listBodyStyle"
                                      : "listBodyStyle listBodyOverflow"
                                  }
                                  renderItem={(item) => (
                                    <List.Item
                                      className="justify-content-center"
                                      style={{ fontSize: "1rem" }}
                                    >
                                      {item.name}
                                    </List.Item>
                                  )}
                                />
                              ) : (
                                <div className="col-12">
                                  <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="No Applications"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      toggleState === 2 ? "content  active-content" : "content"
                    }
                  >
                    <div>
                      <div className="d-flex mb-4">
                        <div className="form-group w-25">
                          <label
                            htmlFor="name"
                            className="font-weight-bold fontsize"
                          >
                            Template Name
                            <span className="ml-1" style={{ color: "red" }}>
                              *
                            </span>
                          </label>
                          <Input
                            size="large"
                            className="form-control"
                            id="name"
                            placeholder="Enter template name"
                            onChange={(e) => {
                              if (e.target.value != "") {
                                setTemplateName(e.target.value);
                              } else {
                                setTemplateName("");
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="tempBody">
                        <div className="ml-4 mt-4 font-weight-bold">
                          Applications
                          <div className="float-right w-25 mr-5">
                            <Button
                              type="primary"
                              className="float-right w-25"
                              onClick={openModal}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4 ml-5">
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
                      <div className="float-right w-25 mr-5 mt-4">
                        <Button
                          type="primary"
                          className="float-right w-25"
                          //   onClick={() => setModal(true)}
                        >
                          Save
                        </Button>
                      </div>
                      <TemplateModal
                        visibility={modal}
                        handleClose={handleClose}
                        apps={apps}
                        searchApplication={searchApplication}
                        recommendedLoader={recommendedLoader}
                        onRecommendedItemChecked={onRecommendedItemChecked}
                        handleSubmitRecommendedApplications={
                          handleSubmitRecommendedApplications
                        }
                        Checked={Checked}
                        confirmBtnLoader={confirmBtnLoader}
                      />
                    </div>
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

export default Template;
