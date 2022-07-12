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

const { Search } = Input;

const { Content } = Layout;

const Template = () => {
  const [items, setItems] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const [modal, setModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [confirmBtnLoader, setConfirmBtnLoader] = useState(false);
  const [form] = Form.useForm();

  const getAllTemplates = async () => {
    setPageLoader(true);
    items.splice(0, items.length);
    try {
      let response = await GetTemplates();
      response = await response.json();
      if (response.Result.length > 0) {
        console.log(response.Result);
        setItems(response.Result);
      } else setItems("");
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
    setConfirmBtnLoader(false);
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
                        </div>
                        <div className="float-right w-25 mr-5">
                          <Button
                            type="primary"
                            className="float-right w-25"
                            onClick={() => setModal(true)}
                          >
                            Add
                          </Button>
                        </div>
                        {/* {items.map((synonm) => (
                                                          <Select
                                                              className="selectStyle "
                                                              mode="tags"
                                                            //   value={synonm.text}
                                                              open={false}
                                                              bordered={false}
                                                            //   onDeselect={(e) =>
                                                            //       handleCrossDelete(e, synonm, item)
                                                            //   }
                                                          ></Select>
                                                      ))} */}
                      </div>
                      <div className="float-right w-25 mr-5 mt-4">
                        <Button
                          type="primary"
                          className="float-right w-25"
                          onClick={() => setModal(true)}
                        >
                          Save
                        </Button>
                      </div>
                      {/* <ApplicationModal
                        visibility={modal}
                        handleClose={handleClose}
                        values={modalValues}
                        handleName={handleName}
                        ConfirmHandler={ConfirmHandler}
                        confirmBtnLoader={confirmBtnLoader}
                      /> */}
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
