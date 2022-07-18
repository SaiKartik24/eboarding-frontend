import React, { useState, useEffect } from "react";
import "../access.scss";
import { Button, Input, List, Layout, Empty, Form, Select } from "antd";
import { debounce } from "lodash";
import { GetApplications } from "../../services/application.service";
import { GetTemplateByName } from "../../services/template.service";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

const { Search } = Input;

const { Content } = Layout;

const ByEmployee = () => {
  const path = window.location.pathname.split("/");
  const template = path[3];
  const nextName = path[4];
  const [items, setItems] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [apps, setApps] = useState([]);
  const [form] = Form.useForm();
  const location = useLocation();

  const getAllApps = async () => {
    setPageLoader(true);
    apps.splice(0, apps.length);
    items.splice(0, apps.length);
    setItems([]);
    if (template === "by-employee" && nextName === undefined) {
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
        else setItems([]);
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      setItems([]);
    }
  }, 500);

  useEffect(() => {
    getAllApps();
  }, [location]);

  return (
    <div>
      {template === "by-employee" && nextName === undefined ? (
        <section className="newEmployee h-100">
          <div className="pl-3 my-4 mb-4">
            {pageLoader ? (
              <div className="text-center my-4 py-4">
                <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
                <div className="loaderText mt-2">Fetching</div>
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
                          style={{ marginTop: "2%", marginBottom: "3%" }}
                        >
                          <Search
                            allowClear
                            size="large"
                            onChange={(e) => searchTemplate(e)}
                            placeholder="Email"
                            className="mr-5 w-25"
                          />
                          <div className="orSty">(OR)</div>
                          <Search
                            allowClear
                            size="large"
                            onChange={(e) => searchTemplate(e)}
                            placeholder="Employee Name"
                            className="ml-5 w-25"
                          />
                        </div>
                      </div>
                      {items.length > 0 ? (
                        <div className="chooseSty mt-4 mb-4">
                          <div className="mainTitle">Results</div>
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
                                              "/itaccess/access/by-employee/" +
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
                        </div>
                      ) : null}
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

export default ByEmployee;
