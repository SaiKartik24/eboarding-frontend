import React, { useEffect, useState } from "react";
import "./setup.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router";
import { Layout, Tooltip } from "antd";

const customErrorMessage = "Something went wrong, Please refresh the page.";
const authMessage =
  "You are not authorized. You will be logged out in 5 seconds";

const { Content } = Layout;

const AppDetails = (props) => {
  const navigate = useNavigate();
  const { appId } = useParams();

  // const [appDetails, setAppDetails] = useState({});
  const [pageLoader, setPageLoader] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [appDetails, setAppDetails] = useState([]);
  const location = useLocation();
  if(location.state != null){
  localStorage.setItem("mode", location.state.state);
  }
  const recentApps = [];
  let mode = "";

  useEffect(() => {
    setPageLoader(true);
  }, [location]);

  const navigateToNext = (routePath) => {
    navigate(routePath);
  };

  function getUniqueApps(appsArray, attribute) {
    // store the comparison  values in array
    const unique = appsArray
      .map((e) => e[attribute])

      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the false indexes & return unique objects
      .filter((e) => appsArray[e])
      .map((e) => appsArray[e]);

    return unique;
  }

  return (
    <section className="appDetails h-100">
      <div className="h-100">
        {pageLoader ? (
          <div className="text-center setupLoaderSty">
            <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
            <div className="loaderText mt-2">Loading Setup</div>
          </div>
        ) : (
          <div className="card">
            <div className="my-3 px-4">
              <div className="row">
                <div className="col-12">
                  <div>
                    <div>
                      <h2 className="mainheader fw-bold text-capitalize">
                        <Link
                          className="mt-4 w text-decoration-none"
                          to={"/"}
                        >
                          <Tooltip
                            placement="leftTop"
                            title="Go Back"
                            arrowPointAtCenter
                          >
                            <span>
                              <i className="fas fa-angle-left iconStyle mr-3"></i>
                            </span>
                          </Tooltip>
                        </Link>
                        {appDetails.AppName}
                      </h2>
                    </div>
                    <div>
                      <p className="paragraphStyle">{appDetails.Description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2 pl-4 pr-4 mb-4">
              <div className="container">
                <div className="row">
                  <div className="col-sm">
                    <div
                      onClick={() => navigateToNext("intents")}
                      className="card-sample p-4 cardPointer"
                    >
                      <div className="card-label">Intents</div>
                      <div>
                        <p className="fontStyle">Define your Intents here.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div
                      onClick={() => navigateToNext("entities")}
                      className="card-sample p-4 cardPointer"
                    >
                      <div className="card-label">Entities</div>
                      <div>
                        <p className="fontStyle">Define your Entities here.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div
                      onClick={() => navigateToNext("settings")}
                      className="card-sample p-4 cardPointer"
                    >
                      <div className="card-label">Settings</div>
                      <div>
                        <p className="fontStyle">Overall App Configurations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AppDetails;
