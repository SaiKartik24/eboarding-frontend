import { Button, DatePicker, Input, Modal, Select } from "antd";
import moment from "moment";
import React, { useState } from "react";
import "./modal.scss";

const { Option } = Select;
const dateFormatList = ["MM/DD/YYYY", "MM/DD/YY"];

const ProfileModal = (props) => {
  return (
    <div className="profileModal">
      <Modal
        title={<b>Profile</b>}
        visible={props.values.visibility}
        className="proModal"
        onCancel={props.values.handleClose}
        footer={null}
        keyboard={false}
      >
        <form>
          <div className="d-flex">
            <div className="form-group col-md-4">
              <label htmlFor="name" className="font-weight-bold fontsize">
                Full Name
                {/* <span className="ml-1" style={{ color: "red" }}>
                  *
                </span> */}
              </label>
              <Input
                size="large"
                className="form-control profFont"
                id="name"
                placeholder="Enter fullname"
                value={props.values.fullName}
                disabled={true}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="email" className="font-weight-bold fontsize">
                Email
                {/* <span className="ml-1" style={{ color: "red" }}>
                  *
                </span> */}
              </label>
              <Input
                size="large"
                className="form-control profFont"
                id="email"
                placeholder="Enter email"
                value={props.values.email}
                disabled={true}
              />
            </div>
            <div className="form-group col-md-4 d-flex flex-column">
              <label htmlFor="empType" className="font-weight-bold fontsize">
                Employment Type
                {/* <span className="ml-1" style={{ color: "red" }}>
                  *
                </span> */}
              </label>
              <Select
                defaultValue={props.values.empType}
                disabled={true}
                className="profFont"
              >
                <Option value="Full Time">Full Time</Option>
                <Option value="Contractor">Contractor</Option>
                <Option value="Vendor">Vendor</Option>
              </Select>
            </div>
          </div>
          <div className="d-flex">
            <div className="form-group col-md-4 d-flex flex-column">
              <label htmlFor="empRole" className="font-weight-bold fontsize">
                Employment Role
                {/* <span className="ml-1" style={{ color: "red" }}>
                  *
                </span> */}
              </label>
              <Select
                defaultValue={props.values.empRole}
                disabled={true}
                className="profFont"
              >
                <Option value="Team Member">Team Member</Option>
                <Option value="Administrator">Administrator</Option>
                <Option value="Manager">Manager</Option>
              </Select>
            </div>
            <div className="form-group col-md-4">
              <label
                htmlFor="managerMail"
                className="font-weight-bold fontsize"
              >
                Manager Mail
                {/* <span className="ml-1" style={{ color: "red" }}>
                  *
                </span> */}
              </label>
              <Input
                size="large"
                className="form-control profFont"
                id="managerMail"
                placeholder="Enter Manager Mail"
                value={props.values.managerMail}
                disabled={true}
              />
            </div>
            <div className="form-group col-md-4 d-flex flex-column">
              <label htmlFor="startDate" className="font-weight-bold fontsize">
                Start Date
                {/* <span className="ml-1" style={{ color: "red" }}>
                  *
                </span> */}
              </label>
              <DatePicker
                defaultValue={moment(props.values.startDate, dateFormatList[0])}
                disabled={true}
                className="profFont"
              />
            </div>
          </div>
          <div className="d-flex">
            <div className="form-group col-md-4 d-flex flex-column">
              <label htmlFor="status" className="font-weight-bold fontsize">
                Status
                {/* <span className="ml-1" style={{ color: "red" }}>
                  *
                </span> */}
              </label>
              <Select
                defaultValue={props.values.status}
                disabled={true}
                className="profFont"
              >
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </div>
          </div>
        </form>
        <Button className="mCancel" onClick={props.values.handleClose}>
          Cancel
        </Button>
      </Modal>
    </div>
  );
};

export default ProfileModal;
