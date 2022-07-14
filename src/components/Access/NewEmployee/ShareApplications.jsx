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
} from "antd";
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
import { Link, useParams } from "react-router-dom";
import { GetTemplateById } from "../../services/newEmployee.services";

const { Search } = Input;

const { Content } = Layout;

const ShareApplications = () => {
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

  const getTemplateById = async () => {
    setPageLoader(true);
    templateApplications.splice(0, templateApplications.length);
    try {
      let response = await GetTemplateById(templateId);
      response = await response.json();
      if (response.Result[0].applications.length > 0) {
        setTemplateApplications(response.Result[0].applications);
      } else setTemplateApplications("");
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
    setTemplateApplications(resultArray);
    setConfirmBtnLoader(false);
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    // let applicationDetails = {
    //   name: templateName,
    //   applications: templateApplications,
    // };
    // try {
    //   let applicationResponse = await AddTemplate(applicationDetails);
    //   applicationResponse = await applicationResponse.json();
    //   SaveTemplateNotification();
    //   setConfirmBtnLoader(false);
    //   apps.map((appData) => {
    //     return (appData.checked = false);
    //   });
    //   setChecked(false);
    //   resultArray.splice(0, resultArray.length);
    //   templateApplications.splice(0, templateApplications.length);
    //   setTemplateName("");
    //   getTemplateById();
    // } catch (error) {
    //   console.log("Error", error);
    // }
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
      <section className="newEmployee h-100">
        <div className="pl-3 my-4 mb-4">
          {pageLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
              <div className="loaderText mt-2">Fetching Template</div>
            </div>
          ) : (
            <>
              <div className="container">
                <div className="content-tabs">
                  <div className="content  active-content">
                    <div>
                      <div>
                        <Link
                          className="mt-4 w text-decoration-none"
                          to={"/itaccess/access/new-employee"}
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
                      </div>
                      <div className="tempBody mt-3">
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
                          onClick={ConfirmHandler}
                        >
                          {confirmBtnLoader ? (
                            <i className="fas fa-spinner fa-2x fa-spin spinner saveSpinner spinnerColor"></i>
                          ) : null}
                          Share
                        </Button>
                      </div>
                      <TemplateModal
                        visibility={modal}
                        handleClose={handleClose}
                        apps={apps}
                        recommendedLoader={recommendedLoader}
                        onRecommendedItemChecked={onRecommendedItemChecked}
                        handleSubmitRecommendedApplications={
                          handleSubmitRecommendedApplications
                        }
                        Checked={Checked}
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

export default ShareApplications;
