import React, { useEffect, useState } from "react";
import "./setup.scss";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import * as XLSX from "xlsx";
import SelectFun from "../common/Select/Select";
import {
  AddEmployee,
  DeleteEmployee,
  GetEmployeeByMail,
  GetEmployees,
  UpdateEmployee,
} from "../services/setup.service";
import PopUpModal from "../common/Modal/Modal";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import InputFun from "../common/Input/InputFun";
import { useParams } from "react-router";
import AddEmployeeRequiredNotification from "../common/Notifications/RequiredNotification";
import { recordUpdateNotification } from "../common/Notifications/UpdateNotifications";
import { recordDeleteNotification } from "../common/Notifications/DeleteNotifications";
import { debounce } from "lodash";

const { Option } = Select;
const { Search } = Input;

const Setup = (props) => {
  const [form] = Form.useForm();
  const [pageLoader, setPageLoader] = useState(true);
  const [items, setItems] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const employeeType = ["Full Time", "Contractor", "Vendor"];
  const employeeRole = ["Team Member", "Administator", "Manager"];
  const Status = ["Active", "Inactive"];
  const [modal, setModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empType, setEmpType] = useState("Full Time");
  const [empRole, setEmpRole] = useState("Team Member");
  const [managerMail, setManagerMail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active");
  const [confirmBtnLoader, setConfirmBtnLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectStartDate, setSelectStartDate] = useState(false);
  const [selectEndDate, setSelectEndDate] = useState(false);
  const [submitExcel, setSubmitExcel] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const handleClose = () => {
    setModal(false);
    setStatus("Active");
    setEndDate(null);
    setStartDate(null);
    setManagerMail("");
    setEmpRole("Team Member");
    setEmpType("Full Time");
    setPassword("");
    setEmail("");
    setFullName("");
    setUserName("");
    setConfirmBtnLoader(false);
    setExcelData([]);
    setSubmitExcel(false);
  };
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
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
    // console.log("record", record);
    const inputNode =
      inputType === "employmenttype" ? (
        <SelectFun field={record} type="employmenttype" values={employeeType} />
      ) : inputType === "role" ? (
        <SelectFun field={record} type="role" values={employeeRole} />
      ) : inputType === "status" ? (
        <SelectFun field={record} type="status" values={Status} />
      ) : inputType === "startdate" ? (
        // <Input value={record.startdate}
        // onChange={(e)=> record.startdate(e.target.value)} />
        <DatePicker
          value={moment(record.startdate, dateFormatList[0])}
          allowClear={false}
          format={dateFormatList}
          onChange={(val) => {
            console.log(val);
            record.startdate = val.format("MM/DD/YYYY");
          }}
        />
      ) : inputType === "enddate" ? (
        // <Input value={record.enddate}
        //   onChange={(e) => record.enddate(e.target.value)} />
        <DatePicker
          value={moment(record.enddate, dateFormatList[0])}
          allowClear={false}
          format={dateFormatList}
          onChange={(val) => {
            record.enddate = val.format("MM/DD/YYYY");
          }}
        />
      ) : inputType === "fullname" ? (
        <InputFun field={record} type="fullname" />
      ) : inputType === "mail" ? (
        <InputFun field={record} type="mail" />
      ) : inputType === "managermail" ? (
        <InputFun field={record} type="managermail" />
      ) : inputType === "username" ? (
        <InputFun field={record} type="username" />
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

  const ExcelDateToJSDate = (date) => {
    let converted_date = new Date(Math.round((date - 25569) * 864e5));
    converted_date = String(converted_date).slice(4, 15);
    date = converted_date.split(" ");
    let day = date[1];
    let month = date[0];
    month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
    if (month.toString().length <= 1) month = "0" + month;
    let year = date[2];
    return String(day + "-" + month + "-" + year);
  };

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
      d.map((item) => {
        let startDate = ExcelDateToJSDate(item.startdate);
        item.startdate = startDate;
        let endDate = ExcelDateToJSDate(item.enddate);
        item.enddate = endDate;
      });
      // setItems([...items, ...d]);
      setExcelData(d);
      setSubmitExcel(true);
    });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    setPageLoader(true);
    items.splice(0, items.length);
    try {
      let employeeResponse = await GetEmployees();
      employeeResponse = await employeeResponse.json();
      if (employeeResponse.Result.length > 0) {
        setItems(employeeResponse.Result);
      } else setItems("");
      setTimeout(() => {
        setPageLoader(false);
      }, 1000);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const isEditing = (record) => record._id === editingKey;

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
      let response = await UpdateEmployee(record, record._id);
      response = await response.json();
      recordUpdateNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFunc = async (record) => {
    try {
      let response = await DeleteEmployee(record, record._id);
      response = await response.json();
      // getEmployees();
      let idToRemove = record._id;
      let myArr = items.filter(function (item) {
        return item._id != idToRemove;
      });
      setItems(myArr);
      recordDeleteNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: <b>Full Name</b>,
      dataIndex: "fullname",
      key: "fullname",
      editable: true,
    },
    {
      title: <b>User Name</b>,
      dataIndex: "username",
      key: "username",
      editable: true,
    },
    {
      title: <b>Mail</b>,
      dataIndex: "mail",
      key: "mail",
      editable: true,
    },
    {
      title: <b>Status</b>,
      dataIndex: "status",
      key: "status",
      editable: true,
    },
    {
      title: <b>Employee Type</b>,
      dataIndex: "employmenttype",
      key: "employmenttype",
      editable: true,
    },
    {
      title: <b>Employee Role</b>,
      dataIndex: "role",
      key: "role",
      editable: true,
    },
    {
      title: <b>Manager Mail</b>,
      dataIndex: "managermail",
      key: "managermail",
      editable: true,
    },
    {
      title: <b>Start Date</b>,
      dataIndex: "startdate",
      key: "startdate",
      editable: true,
    },
    {
      title: <b>End Date</b>,
      dataIndex: "enddate",
      key: "enddate",
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
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "employmenttype"
            ? "employmenttype"
            : col.dataIndex === "role"
            ? "role"
            : col.dataIndex === "status"
            ? "status"
            : col.dataIndex === "startdate"
            ? "startdate"
            : col.dataIndex === "enddate"
            ? "enddate"
            : col.dataIndex === "fullname"
            ? "fullname"
            : col.dataIndex === "username"
            ? "username"
            : col.dataIndex === "mail"
            ? "mail"
            : col.dataIndex === "managermail"
            ? "managermail"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  let modalValues = {
    fullName: fullName,
    userName: userName,
    email: email,
    empType: empType,
    empRole: empRole,
    managerMail: managerMail,
    startDate: startDate,
    endDate: endDate,
    status: status,
  };

  const handleFullname = (val) => {
    setFullName(val);
  };

  const handleUserName = (val) => {
    setUserName(val);
  };

  const handleMail = (val) => {
    setEmail(val);
  };

  const handlePassword = (val) => {
    setPassword(val);
  };

  const handleEmpType = (val) => {
    setEmpType(val);
  };

  const handleEmpyRole = (val) => {
    setEmpRole(val);
  };

  const handleManagerMail = (val) => {
    setManagerMail(val);
  };

  const handleStartDate = (val) => {
    setStartDate(val.format("MM/DD/YYYY"));
  };

  const handleEndDate = (val) => {
    setEndDate(val.format("MM/DD/YYYY"));
  };

  const handleStatus = (val) => {
    setStatus(val);
  };

  const ConfirmHandler = async () => {
    setConfirmBtnLoader(true);
    if (
      fullName != "" &&
      userName != "" &&
      email != "" &&
      managerMail != "" &&
      startDate !== "" &&
      submitExcel != true
    ) {
      let empDetails = {
        username: userName,
        password: "itaccess@123",
        fullname: fullName,
        mail: email,
        employmenttype: empType,
        role: empRole,
        managermail: managerMail,
        managerid: "",
        startdate: startDate,
        enddate: endDate,
        status: status,
        lastlogindate: "",
      };
      try {
        let employeeResponse = await AddEmployee(empDetails);
        employeeResponse = await employeeResponse.json();
        getEmployees();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (
      fullName != "" &&
      userName != "" &&
      email != "" &&
      managerMail != "" &&
      startDate !== "" &&
      submitExcel == true
    ) {
      let empDetails = {
        username: userName,
        password: "itaccess@123",
        fullname: fullName,
        mail: email,
        employmenttype: empType,
        role: empRole,
        managermail: managerMail,
        managerid: "",
        startdate: startDate,
        enddate: endDate,
        status: status,
        lastlogindate: "",
      };
      try {
        let employeeResponse = await AddEmployee(empDetails);
        employeeResponse = await employeeResponse.json();
        // getEmployees();
      } catch (error) {
        console.log("Error", error);
      }
      try {
        let employeeResponse = await AddEmployee(excelData);
        employeeResponse = await employeeResponse.json();
        getEmployees();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else if (
      fullName == "" &&
      userName == "" &&
      email == "" &&
      managerMail == "" &&
      startDate == "" &&
      submitExcel == true
    ) {
      try {
        let employeeResponse = await AddEmployee(excelData);
        employeeResponse = await employeeResponse.json();
        getEmployees();
        setConfirmBtnLoader(false);
        setModal(false);
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      AddEmployeeRequiredNotification();
      setConfirmBtnLoader(false);
    }
  };

  const searchEmployee = debounce(async (e) => {
    let val = e.target.value;
    try {
      let response = await GetEmployeeByMail(val);
      response = await response.json();
      setItems(response.Result);
    } catch (error) {
      console.log("Error", error);
    }
  }, 500);

  return (
    <section className="setup h-100">
      <div className="h-100">
        {pageLoader ? (
          <div className="text-center setupLoaderSty">
            <i className="fas fa-spinner fa-2x fa-spin spinner spinnerTop"></i>
            <div className="loaderText mt-2">Loading Setup</div>
          </div>
        ) : (
          <div>
              <div className="d-flex float-right mb-4">
                <Search
                  allowClear
                  onChange={(e) => searchEmployee(e)}
                  placeholder="Search for mail"
                  className="mr-3"
                />
              <Button
                type="primary"
                className="buttonStyles"
                onClick={() => setModal(true)}
              >
                Add
              </Button>
              {/* <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
                style={{ width: "250px", fontSize: "1rem" }}
              /> */}
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
                pagination={true}
                // scroll={{
                //   x: 200,
                //   y: 500,
                // }}
              />
            </Form>
            <PopUpModal
              visibility={modal}
              handleClose={handleClose}
              values={modalValues}
              handleFullname={handleFullname}
              handleUserName={handleUserName}
              handleMail={handleMail}
              handlePassword={handlePassword}
              handleEmpType={handleEmpType}
              handleEmpyRole={handleEmpyRole}
              handleManagerMail={handleManagerMail}
              handleStartDate={handleStartDate}
              handleEndDate={handleEndDate}
              handleStatus={handleStatus}
              ConfirmHandler={ConfirmHandler}
              showPassword={showPassword}
              selectStartDate={selectStartDate}
              selectEndDate={selectEndDate}
              confirmBtnLoader={confirmBtnLoader}
              readExcel={readExcel}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Setup;
