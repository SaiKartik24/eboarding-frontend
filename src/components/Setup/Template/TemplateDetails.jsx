import React, { useState, useEffect } from "react";
import "../../Access/access.scss";
import { Button, Input, Layout, Select, Tooltip } from "antd";
import { GetApplications } from "../../services/application.service";
import TemplateModal from "../../common/Modal/TemplateModal";
import { UpdateTemplate } from "../../services/template.service";
import { Link, useParams } from "react-router-dom";
import { GetTemplateById } from "../../services/newEmployee.services";
import { SaveRecordNotification } from "../../common/Notifications/SaveNotifications";
import CheckOutsideClick from "../../common/ClickEvent/ClickEvent";

const TemplateDetails = () => {
  const { tempId } = useParams();
  const [items, setItems] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [editTemplateName, setEditTemplateName] = useState(false);
  const [confirmBtnLoader, setConfirmBtnLoader] = useState(false);
  const [recommendedLoader, setRecommendedLoader] = useState(false);
  const [apps, setApps] = useState([]);
  const [resultArray, setResultArray] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [Checked, setChecked] = useState(false);
  const [templateApplications, setTemplateApplications] = useState([]);
  const [searchApps, setSearchApps] = useState();
  const [searchText, setSearchText] = useState("");
  const searchFilter = (searchTxt) => {
    setSearchText(searchTxt);
    if (searchTxt != "") {
      let filteredApps = apps.filter((val) => {
        if (val.name.toLowerCase().includes(searchTxt.toLowerCase())) {
          //console.log(val);
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
      let response = await GetTemplateById(tempId);
      response = await response.json();
      setTemplateName(response.Result[0].name);
      if (response.Result[0].applications.length > 0) {
        setTemplateApplications(response.Result[0].applications);
      } else setTemplateApplications("");
      getAllApps(response.Result[0].applications);
    } catch (error) {
      //console.log("Error", error);
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
      //console.log("Error", error);
    }
  };

  useEffect(() => {
    getTemplateById();
  }, []);

  const handleClose = () => {
    setModal(false);
    // //console.log(resultArray);
    // setTemplateApplications(resultArray);
    setConfirmBtnLoader(false);
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    //console.log(templateApplications);
    let applicationDetails = {
      _id: tempId,
      name: templateName,
      applications: templateApplications,
    };
    try {
      let applicationResponse = await UpdateTemplate(
        applicationDetails,
        tempId
      );
      applicationResponse = await applicationResponse.json();
      SaveRecordNotification();
      try {
        let response = await GetTemplateById(tempId);
        response = await response.json();
        if (response.Result[0].applications.length > 0) {
          setTemplateApplications(response.Result[0].applications);
        } else setTemplateApplications("");
      } catch (error) {
        //console.log("Error", error);
      }
      setConfirmBtnLoader(false);
    } catch (error) {
      //console.log("Error", error);
    }
  };

  const openModal = async () => {
    setSearchApps([]);
    setSearchText("");
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
      const filterResult = result.map((val) => {
        var item = resultArray.find((item) => item._id === val._id);
        if (item == undefined) {
          resultArray.push(val);
        }
      });
      // //console.log(result);
      // resultArray.splice(0, resultArray.length);
      // resultArray.push(...result);
      if (result.length > 0) setDisabled(false);
      else setDisabled(true);
    }
  };

  const handleSubmitRecommendedApplications = () => {
    // setTemplateApplications(resultArray);
    // //console.log(resultArray);
    resultArray.map((val) => {
      var item = templateApplications.find((item) => item._id === val._id);
      if (item == undefined) {
        templateApplications.push(val);
      }
    });
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

  const handleClick = async () => {
    let name = localStorage.getItem("name");
    setTemplateName(name);
    setEditTemplateName(false);
    let applicationDetails = {
      _id: tempId,
      name: name,
      applications: templateApplications,
    };
    try {
      let applicationResponse = await UpdateTemplate(
        applicationDetails,
        tempId
      );
      applicationResponse = await applicationResponse.json();
      SaveRecordNotification();
      try {
        let response = await GetTemplateById(tempId);
        response = await response.json();
        if (response.Result[0].applications.length > 0) {
          setTemplateApplications(response.Result[0].applications);
        } else setTemplateApplications("");
      } catch (error) {
        //console.log("Error", error);
      }
      setConfirmBtnLoader(false);
    } catch (error) {
      //console.log("Error", error);
    }
  };

  const keyDownHandlerForEdit = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.code === "Enter") {
      setTemplateName(event.target.value);
      setEditTemplateName(false);
      let applicationDetails = {
        _id: tempId,
        name: event.target.value,
        applications: templateApplications,
      };
      try {
        let applicationResponse = await UpdateTemplate(
          applicationDetails,
          tempId
        );
        applicationResponse = await applicationResponse.json();
        SaveRecordNotification();
        try {
          let response = await GetTemplateById(tempId);
          response = await response.json();
          if (response.Result[0].applications.length > 0) {
            setTemplateApplications(response.Result[0].applications);
          } else setTemplateApplications("");
        } catch (error) {
          //console.log("Error", error);
        }
        setConfirmBtnLoader(false);
      } catch (error) {
        //console.log("Error", error);
      }
    }
  };

  return (
    <div>
      <section className="newEmployee h-100">
        <div className="pl-3 my-4 mb-4">
          {pageLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
              <div className="loaderText mt-2">Fetching Template Details</div>
            </div>
          ) : (
            <>
              <div className="container">
                <div className="content-tabs">
                  <div className="content  active-content">
                    <div>
                      <div className="d-flex mb-5">
                        <Link
                          className="mt-2 w text-decoration-none"
                          to={"/itaccess/setup/template"}
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
                          {editTemplateName ? (
                            <CheckOutsideClick onClickOutside={handleClick}>
                              <Input
                                defaultValue={templateName}
                                onChange={(e) => {
                                  setTemplateName(e.target.value);
                                  localStorage.setItem("name", e.target.value);
                                }}
                                onKeyDown={(e) => keyDownHandlerForEdit(e)}
                              />
                            </CheckOutsideClick>
                          ) : (
                            templateName
                          )}
                          <div
                            className={
                              editTemplateName
                                ? "editHide"
                                : "material-icons-outlined align-bottom"
                            }
                            style={{ fontSize: "18px", cursor: "pointer" }}
                            onClick={() => setEditTemplateName(true)}
                          >
                            border_color
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 chooseStyEmpApp mb-4">
                        <div className="mainTitle">Applications</div>
                        <div className="float-right w-25 mr-5">
                          <Button
                            type="primary"
                            className="float-right w-25 mt-3"
                            onClick={openModal}
                          >
                            Add
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
                    </div>
                    <div className="float-right w-25 mr-5">
                      <Button
                        type="primary"
                        className="float-right w-25"
                        onClick={ConfirmHandler}
                      >
                        {confirmBtnLoader ? (
                          <i className="fas fa-spinner fa-2x fa-spin spinner saveSpinner spinnerColor"></i>
                        ) : null}
                        Save
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
                      searchApps={searchApps}
                      searchFilter={searchFilter}
                      searchText={searchText}
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

export default TemplateDetails;
