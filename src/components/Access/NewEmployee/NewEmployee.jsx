import React, { useState, useEffect } from "react";
import "../access.scss";
import { Button, Input, List, Layout, Empty, Form, Select } from "antd";
import { debounce } from "lodash";
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
import { Link, Outlet, useParams } from "react-router-dom";

const { Search } = Input;

const { Content } = Layout;

const NewEmployee = () => {
  const path = window.location.pathname.split("/");
  const template = path[3];
  const nextName = path[4];
  const { templateId } = useParams();
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
    console.log(val);
    if (val !== "") {
      try {
        let response = await GetTemplateByName(val);
        response = await response.json();
        if (response.Result && response.Result.length > 0)
          setItems(response.Result);
        else setItems("");
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      try {
        let response = await GetTemplates();
        response = await response.json();
        if (response.Result.length > 0) {
          setItems(response.Result);
        } else setItems("");
      } catch (error) {
        console.log("Error", error);
      }
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
    setConfirmBtnLoader(false);
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    if (templateName != "") {
      let applicationDetails = {
        name: templateName,
        applications: templateApplications,
      };
      try {
        let applicationResponse = await AddTemplate(applicationDetails);
        applicationResponse = await applicationResponse.json();
        SaveTemplateNotification();
        setConfirmBtnLoader(false);
        apps.map((appData) => {
          return (appData.checked = false);
        });
        setChecked(false);
        resultArray.splice(0, resultArray.length);
        templateApplications.splice(0, templateApplications.length);
        setTemplateName("");
        getAllTemplates();
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      AddTemplateRequiredNotification();
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
  };

  return (
    <div>
      {template === "new-employee" && nextName === undefined ? (
        <section className="newEmployee h-100">
          <div className="pl-3 my-4 mb-4">
            {pageLoader ? (
              <div className="text-center my-4 py-4">
                <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
                <div className="loaderText mt-2">Fetching Templates</div>
              </div>
            ) : (
              <>
                <div className="container">
                  <div className="content-tabs">
                    <div className="content  active-content d-flex flex-column">
                      <div className="chooseSty mt-4 mb-4">
                        <div className="mainTitle">Search</div>
                        <div
                          className="d-flex justify-content-center"
                          style={{ marginTop: "2%" }}
                        >
                          <Search
                            allowClear
                            size="large"
                            onChange={(e) => searchTemplate(e)}
                            placeholder="Existing employee email"
                            className="mr-5 w-25"
                          />
                          <div className="orSty">(OR)</div>
                          <Search
                            allowClear
                            size="large"
                            onChange={(e) => searchTemplate(e)}
                            placeholder="Template Name"
                            className="ml-5 w-25"
                          />
                        </div>
                      </div>
                      <div className="chooseSty mt-4 mb-4">
                        <div className="mainTitle">Templates</div>
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
                                      <Link
                                        className="linkStyle"
                                        to={{
                                          pathname:
                                            "/itaccess/access/new-employee/" +
                                            item._id,
                                          state: { item },
                                        }}
                                      >
                                        {item.name}
                                      </Link>
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
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      ) : (
        <Content
          className="site-layout-background"
          style={{
            margin: 0,
            height: "auto",
            // overflowY: "auto",
          }}
        >
          <Outlet />
        </Content>
      )}
    </div>
  );
};

export default NewEmployee;
