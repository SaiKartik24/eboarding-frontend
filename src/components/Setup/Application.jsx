import React, { useState, useEffect } from "react";
import "./setup.scss";
import {
  Button,
  Input,
  List,
  Layout,
  Empty,
  Form,
  Table,
  Tooltip,
  Typography,
  Popconfirm,
} from "antd";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import {
  AddApplication,
  DeleteApplicaion,
  GetApplicationByName,
  GetApplications,
  UpdateApplication,
} from "../services/application.service";
import {
  ApplicationEnvSelect,
  ApplicationSelect,
} from "../common/Select/ApplicationSelect";
import ApplicationInput from "../common/Input/ApplicationInput";
import ApplicationModal from "../common/Modal/ApplicationModal";
import { AddApplicationRequiredNotification } from "../common/Notifications/RequiredNotification";
import { recordUpdateNotification } from "../common/Notifications/UpdateNotifications";
import { applicationDeleteNotification } from "../common/Notifications/DeleteNotifications";

const { Search } = Input;

const { Content } = Layout;

const Application = () => {
  const [items, setItems] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [pageLoader, setPageLoader] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Hardware");
  const [env, setEnv] = useState("DEV");
  const [approverMail, setApproverMail] = useState("");
  const [teamMail, setTeamMail] = useState("");
  const Applicationtype = ["Hardware", "Software"];
  const envType = ["DEV", "QA", "PROD"];
  const [confirmBtnLoader, setConfirmBtnLoader] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [submitExcel, setSubmitExcel] = useState(false);
  const [connectorType, setconnectorType] = useState("");
  const [form] = Form.useForm();

  const getAllApplications = async () => {
    setPageLoader(true);
    items.splice(0, items.length);
    try {
      let applicationResponse = await GetApplications();
      applicationResponse = await applicationResponse.json();
      if (applicationResponse.Result.length > 0) {
        console.log(applicationResponse.Result);
        setItems(applicationResponse.Result);
      } else setItems("");
      setTimeout(() => {
        setPageLoader(false);
      }, 1000);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const searchApplication = debounce(async (e) => {
    let val = e.target.value;
    if (val !== "") {
      try {
        let applicationResponse = await GetApplicationByName(val);
        applicationResponse = await applicationResponse.json();
        if (applicationResponse.Result && applicationResponse.Result.length > 0)
          setItems(applicationResponse.Result);
        else setItems("");
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      try {
        let applicationResponse = await GetApplications();
        applicationResponse = await applicationResponse.json();
        if (applicationResponse.Result && applicationResponse.Result.length > 0)
          setItems(applicationResponse.Result);
        else setItems("");
      } catch (error) {
        console.log("Error", error);
      }
    }
  }, 500);

  useEffect(() => {
    getAllApplications();
  }, []);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      // setItems([...items, ...d]);
      setExcelData(d);
      setSubmitExcel(true);
    });
  };

  const toggleTab = (index) => {
    setToggleState(index);
  };

  const edit = (record) => {
    console.log("record", record);
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (record) => {
    setEditingKey("");
    try {
      let response = await UpdateApplication(record, record._id);
      response = await response.json();
      recordUpdateNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFunc = async (record) => {
    try {
      let response = await DeleteApplicaion(record, record._id);
      response = await response.json();
      // getAllApplications();
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

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "type" ? (
        <ApplicationSelect
          field={record}
          type="type"
          values={Applicationtype}
        />
      ) : inputType === "name" ? (
        <ApplicationInput field={record} type="name" />
      ) : inputType === "env" ? (
        <ApplicationEnvSelect field={record} type="env" values={envType} />
      ) : inputType === "approverMail" ? (
        <ApplicationInput field={record} type="approverMail" />
      ) : inputType === "teamMail" ? (
        <ApplicationInput field={record} type="teamMail" />
      ) : inputType === "connectorType" ? (
        <ApplicationInput field={record} type="connectorType" />
      ) : (
        <Input />
      );
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const columns = [
    {
      title: <b>Name</b>,
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: <b>Type</b>,
      dataIndex: "type",
      key: "type",
      editable: true,
    },
    {
      title: <b>Environment</b>,
      dataIndex: "env",
      key: "env",
      editable: true,
    },
    {
      title: <b>Approver Mail</b>,
      dataIndex: "approverMail",
      key: "approverMail",
      editable: true,
    },
    {
      title: <b>Team Mail</b>,
      dataIndex: "teamMail",
      key: "teamMail",
      editable: true,
    },
    {
      title: <b>Connector Type</b>,
      dataIndex: "connectorType",
      key: "connectorType",
      editable: true,
    },
    {
      title: <b>Actions</b>,
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              onClick={() => {
                edit(record);
              }}
              className="mr-2"
            >
              <Tooltip title="Edit">
                <i className="fas fa-edit" style={{ color: "blue" }}></i>
              </Tooltip>
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                deleteFunc(record);
              }}
            >
              <Tooltip title="Delete">
                <i
                  className="fas fa-trash ml-1 mr-1"
                  style={{ color: "red" }}
                ></i>
              </Tooltip>
            </Typography.Link>
          </span>
        );
      },
    },
  ];
  const isEditing = (record) => record._id === editingKey;
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "name"
            ? "name"
            : col.dataIndex === "type"
            ? "type"
            : col.dataIndex === "env"
            ? "env"
            : col.dataIndex === "approverMail"
            ? "approverMail"
            : col.dataIndex === "teamMail"
            ? "teamMail"
            : col.dataIndex === "connectorType"
            ? "connectorType"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleName = (val) => {
    setName(val);
  };

  const handleType = (val) => {
    setType(val);
  };

  const handleEnv = (val) => {
    setEnv(val);
  };

  const handleApproveMail = (val) => {
    setApproverMail(val);
  };

  const handleTeamMail = (val) => {
    setTeamMail(val);
  };

  const handleconnectorType = (val) => {
    setconnectorType(val);
  };

  let modalValues = {
    name: name,
    type: type,
    approveMail: approverMail,
    teamMail: teamMail,
    env: env,
    connectorType: connectorType,
  };

  const handleClose = () => {
    setModal(false);
    setName("");
    setEnv("DEV");
    setApproverMail("");
    setTeamMail("");
    setType("Hardware");
    setconnectorType("");
    setConfirmBtnLoader(false);
    setExcelData([]);
    setSubmitExcel(false);
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    if (
      name != "" &&
      approverMail != "" &&
      teamMail != "" &&
      connectorType !== "" &&
      submitExcel != true
    ) {
      let applicationDetails = {
        name: name,
        type: type,
        env: env,
        approverMail: approverMail,
        teamMail: teamMail,
        connectorType: connectorType,
      };
      try {
        let applicationResponse = await AddApplication(applicationDetails);
        applicationResponse = await applicationResponse.json();
        getAllApplications();
        handleClose();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (
      name != "" &&
      approverMail != "" &&
      teamMail != "" &&
      connectorType !== "" &&
      submitExcel == true
    ) {
      let applicationDetails = {
        name: name,
        type: type,
        env: env,
        approverMail: approverMail,
        teamMail: teamMail,
        connectorType: connectorType,
      };
      try {
        let applicationResponse = await AddApplication(applicationDetails);
        applicationResponse = await applicationResponse.json();
        //   getAllApplications();
      } catch (error) {
        console.log("Error", error);
      }
      try {
        let response = await AddApplication(excelData);
        response = await response.json();
        getAllApplications();
        handleClose();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (
      name == "" &&
      approverMail == "" &&
      teamMail == "" &&
      connectorType == "" &&
      submitExcel == true
    ) {
      try {
        let response = await AddApplication(excelData);
        response = await response.json();
        getAllApplications();
        handleClose();
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
        <div className="h-100">
          {pageLoader ? (
            <div className="text-center my-4 py-4">
              <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
              <div className="loaderText mt-2">Fetching All Applications</div>
            </div>
          ) : (
            <div>
              <div className="d-flex float-right mb-4">
                <Search
                  allowClear
                  // size="large"
                  onChange={(e) => searchApplication(e)}
                  placeholder="Search for application"
                  className="mr-3"
                />
                <Button
                  type="primary"
                  className="buttonStyles"
                  onClick={() => setModal(true)}
                >
                  Add
                </Button>
              </div>
              <Form form={form} component={false}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  bordered
                  dataSource={items}
                  columns={mergedColumns}
                  rowClassName="editable-row"
                  pagination={{ pageSize: 7 }}
                  // scroll={{
                  //   x: 200,
                  //   y: 500,
                  // }}
                />
              </Form>
              <ApplicationModal
                visibility={modal}
                handleClose={handleClose}
                values={modalValues}
                handleName={handleName}
                handleEnv={handleEnv}
                handleApproveMail={handleApproveMail}
                handleTeamMail={handleTeamMail}
                handleType={handleType}
                handleAccessType={handleconnectorType}
                ConfirmHandler={ConfirmHandler}
                confirmBtnLoader={confirmBtnLoader}
                readExcel={readExcel}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Application;
