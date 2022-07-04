import React, { useEffect, useState } from "react";
import "./setup.scss";

const Setup = (props) => {

  const [pageLoader, setPageLoader] = useState(true);

  useEffect(() => {
    setPageLoader(true);
  }, []);

  
  return (
    <section className="setup h-100">
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

export default Setup;
