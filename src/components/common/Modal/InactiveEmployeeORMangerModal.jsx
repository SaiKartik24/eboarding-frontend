import React from "react";
import { Button, Modal, Table } from "antd";
import "./modal.scss";

const InactiveEmployeeORMangerModal = (props) => {
  const columns = [
    {
      title: <b>Employee Name</b>,
      dataIndex: "empName",
    },
    {
      title: <b>Manager Name</b>,
      dataIndex: "managerName",
    },
    {
      title: <b>Application Name</b>,
      dataIndex: "appName",
    },
    {
      title: <b>Application Owner</b>,
      dataIndex: "appOwner",
    },
  ];

  const accessColumns = [
    {
      title: <b>Employee Name</b>,
      dataIndex: "empName",
    },
    {
      title: <b>Manager Name</b>,
      dataIndex: "managerName",
    },
  ];
  return (
    <Modal
      title={
        props.from == "inactiveEmployees" ? (
          <b>Inactive Employees having access to applications</b>
        ) : (
          <b>Employees with Inactive Manager</b>
        )
      }
      visible={props.pendingModal}
      className="modalFont"
      onCancel={() => {
        props.setPendingModal(false);
      }}
      footer={null}
      keyboard={false}
    >
      <Table
        columns={props.from == "inactiveEmployees" ? columns : accessColumns}
        dataSource={props.pendingApprovals}
        size="middle"
        bordered={true}
      />
      <Button
        style={{
          left: "90%",
          fontSize: "1rem",
          height: "fit-content",
          width: "118px",
        }}
        onClick={() => {
          props.setPendingModal(false);
        }}
      >
        Cancel
      </Button>
    </Modal>
  );
};

export default InactiveEmployeeORMangerModal;
