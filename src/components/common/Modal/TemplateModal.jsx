import React, { useState } from "react";
import { Button, Checkbox, DatePicker, Input, List, Modal, Select } from "antd";
import "./modal.scss";

const { Search } = Input;
const { Option } = Select;
const TemplateModal = (props) => {
  let apps = props.apps;
  const [searchApps, setSearchApps] = useState(props.apps);
  const searchFilter = (searchText) => {
    let filteredApps = apps.filter((val) => {
      if (searchText == "") {
        return val;
      } else if (val.name.toLowerCase().includes(searchText.toLowerCase())) {
        return val;
      }
    });
    setSearchApps(filteredApps);
  };
  return (
    <Modal
      title={<b>Add Applications</b>}
      visible={props.visibility}
      className="modalFont modalSection"
      onCancel={props.handleClose}
      footer={null}
      keyboard={false}
    >
      <form>
        <div className="form-group d-flex">
          <Search
            allowClear
            // size="large"
            onChange={(e) => searchFilter(e.target.value)}
            placeholder="Search for application"
            className="mr-3"
          />
        </div>
        <div className="form-group">
          {props.recommendedLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerColor" />
              <div className="loaderText spinnerColor mt-2">
                <b>Loading Apps</b>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-1">
                <Checkbox
                  className="mr-4"
                  onChange={(e, value) =>
                    props.onRecommendedItemChecked(null, e, "selectAll")
                  }
                  checked={props.Checked}
                ></Checkbox>
                <span className="selectSize selectStyle">
                  {props.Checked ? <b>Deselect All</b> : <b>Select All</b>}
                </span>
              </div>
              <List
                itemLayout="horizontal"
                dataSource={searchApps}
                className="modalListStyle"
                renderItem={(item) => (
                  <List.Item className="ml-0 d-inline-flex w-100 justify-content-lg-start">
                    <Checkbox
                      className="mr-4"
                      onChange={(e, value) =>
                        props.onRecommendedItemChecked(item, e, "selectOne")
                      }
                      checked={item.checked}
                    />
                    <List.Item className="listStyle">{item.name}</List.Item>
                  </List.Item>
                )}
              />
            </>
          )}
        </div>
      </form>
      <div style={{ textAlign: "right" }}>
        <Button className="btnWidth mr-4" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button
          type="primary"
          className="float-right buttonStyle btnWidth"
          onClick={props.handleSubmitRecommendedApplications}
          disabled={props.disabled}
        >
          {props.addSpinner ? (
            <i className="fas fa-spinner fa-2x fa-spin spinner spinnerColor"></i>
          ) : null}
          Add
        </Button>
      </div>
    </Modal>
  );
};

export default TemplateModal;
