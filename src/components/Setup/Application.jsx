import React, { useState, useEffect } from "react";
import "./setup.scss";
import {
  Button,
  Input,
  List,
  Layout,
  Empty,
} from "antd";
import { useParams } from "react-router";
import { Link, Outlet, useLocation } from "react-router-dom";
import { debounce } from "lodash";
import {
  AddApplication,
  GetApplicationByName,
  GetApplications,
} from "../services/application.service";

const { Search } = Input;

const { Content } = Layout;

const Application = () => {
  const path = window.location.pathname.split("/");
  const appname = path[3];
  const nextname = path[4];
  const { appId } = useParams();

  const [pageLoader, setPageLoader] = useState(false);
  const [createIntentSpinner, setCreateIntentSpinner] = useState(false);
  const [application, setApplication] = useState("");
  const [searchText, setSearchText] = useState("");
  const [applicationData, setApplicationData] = useState("");
  const location = useLocation();

  useEffect(() => {
    getAllApplications();
    setApplication("");
  }, [location]);

  const getAllApplications = async () => {
    setPageLoader(true);
    let applicationResponse = await GetApplications();
    applicationResponse = await applicationResponse.json();
    setApplicationData(applicationResponse);
    setPageLoader(false);
  };

  const searchApplication = debounce(async (e) => {
    let val = e.target.value;
    try {
      let applicationResponse = await GetApplicationByName(val);
      applicationResponse = await applicationResponse.json();
      setApplicationData(applicationResponse);
    } catch (error) {
      console.log("Error", error);
    }
  }, 500);

  const handleSubmitApplication = async () => {
    setCreateIntentSpinner(true);
    let reqData = "";
    let applicationResponse = await AddApplication(reqData);
    applicationResponse = await applicationResponse.json();
    application.splice(0, 0, applicationResponse);
    setCreateIntentSpinner(false);
    setApplication("");
  };

  const ListHeader = () => {
    return (
      <div className="listHeader">
        <span className="listHeader-heading leftStyle">Applications</span>
      </div>
    );
  };

  return (
    <div>
      {appname === "application" && nextname === undefined ? (
        <section className="application">
          <div className="pl-3 my-4 mb-4">
            {pageLoader ? (
              <div className="text-center my-4 py-4">
                <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
                <div className="loaderText mt-2">Fetching Applications</div>
              </div>
            ) : (
              <div className="card">
                <div className="my-3 px-4">
                  <div className="row mt-4">
                    <div className="col-sm">
                      <div className="applicationResponsive">
                        <div className="d-flex addApplication">
                          <Input
                            className={"mr-2 inputfield"}
                            value={application}
                            placeholder="Add your Application"
                            onChange={(e) => {
                              if (e.target.value != "")
                                setApplication(e.target.value);
                              else setApplication("");
                            }}
                          />
                          <Button
                            type="primary"
                            className="buttonSty"
                            onClick={handleSubmitApplication}
                          >
                            {createIntentSpinner ? (
                              <i className="fas fa-spinner fa-spin spinner mr-2 spinnerColor" />
                            ) : null}
                            New
                          </Button>
                        </div>
                        <div>
                          <Search
                            allowClear
                            onChange={(e) => searchApplication(e)}
                            placeholder="Search for Application"
                            className="ml-auto searchRes float-right mcp-light-blue"
                          />
                        </div>
                      </div>
                      <div className="mt-2 applicationData">
                        <ListHeader />
                        {applicationData.length > 0 ? (
                          <List
                            itemLayout="horizontal"
                            dataSource={applicationData}
                            className={
                              applicationData.length == 0
                                ? "listBodyStyle"
                                : "listBodyStyle listBodyOverflow"
                            }
                            renderItem={(item) => (
                              <List.Item>
                                <Link className="linkStyle">
                                  {item.IntentName}
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
                            ;
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

export default Application;
