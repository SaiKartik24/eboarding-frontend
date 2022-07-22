import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  List,
  Modal,
  Select,
  Radio,
} from "antd";
import "./modal.scss";

const { Search } = Input;
const { Option } = Select;
const GrantRevokeModal = (props) => {
  return (
    <Modal
      title={<b>{props.title}</b>}
      visible={props.visibility}
      className="modalFont modalSection"
      onCancel={props.handleClose}
      footer={null}
      keyboard={false}
    >
      {props.showAction && (
        <div className="d-flex mb-3">
          <div className="mr-3 font-weight-bold" style={{ fontSize: "1rem" }}>
            Action
          </div>
          <Radio.Group
            name="radiogroup"
            defaultValue={props.selectedAction}
            onChange={(e) => props.setSelectedAction(e.target.value)}
          >
            <Radio value={props.requestActions[0]} style={{ fontSize: "1rem" }}>
              {props.requestActions[0]}
            </Radio>
            <Radio value={props.requestActions[1]} style={{ fontSize: "1rem" }}>
              {props.requestActions[1]}
            </Radio>
          </Radio.Group>
        </div>
      )}
      <form>
        <div className="form-group d-flex">
          <Search
            allowClear
            // size="large"
            value={props.searchText}
            onChange={(e) => props.searchFilter(e.target.value)}
            placeholder="Search for application"
            className="mr-3"
          />
        </div>
        <div className="form-group">
          {props.recommendedLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerColor" />
              <div className="loaderText spinnerColor mt-2">
                <b>Loading</b>
              </div>
            </div>
          ) : (
            <>
              <List
                itemLayout="horizontal"
                dataSource={props.searchApps}
                className="modalListStyle"
                renderItem={(item) => (
                  <List.Item className="ml-0 d-inline-flex w-100 justify-content-lg-start">
                    <Checkbox
                      className="mr-4"
                      onChange={(e, value) => {
                        props.onRecommendedItemChecked(item, e, "selectOne");
                      }}
                      // checked={item.checked}
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
          {props.showAction ? props.selectedAction : "Revoke"}
        </Button>
      </div>
    </Modal>
  );
};

export default GrantRevokeModal;
