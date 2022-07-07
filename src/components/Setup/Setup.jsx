import React, { useEffect, useState } from "react";
import "./setup.scss";
import { Button, Form, Input, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography } from 'antd';
import * as XLSX from "xlsx";
import SelectFun from "../common/Select/Select";
import { GetEmployees } from "../services/setup.service";
import PopUpModal from "../common/Modal/Modal";

const { Option } = Select;


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
    const inputNode = inputType === 'employmenttype' ? (
      <SelectFun field={record} type="employmenttype" values={employeeType} />
    ) : (inputType === "role" ? <SelectFun field={record} type="role" values={employeeRole} /> : (
        inputType === "status" ? (<SelectFun field={record} type="status" values={Status} /> ):<Input />));
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
    converted_date = String(converted_date).slice(4, 15)
    date = converted_date.split(" ")
    let day = date[1];
    let month = date[0];
    month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1
    if (month.toString().length <= 1)
      month = '0' + month
    let year = date[2];
    return String(day + '-' + month + '-' + year)
  }

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
        let startDate = ExcelDateToJSDate(item.startdate)
        item.startdate = startDate;
        let endDate = ExcelDateToJSDate(item.enddate)
        item.enddate = endDate;
      })
      console.log(d);
      setItems([...items, ...d]);
    });
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async() => {
    setPageLoader(true);
    try {
      let employeeResponse = await GetEmployees();
      employeeResponse = await employeeResponse.json();
      setItems(employeeResponse.Result[0].employees);
      console.log(employeeResponse);
      setPageLoader(false);
    } catch (error) {
      console.log("Error", error);
    }
  }

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const columns = [
    {
      title: <b>Full Name</b>,
      dataIndex: 'fullname',
      key: 'fullname',
      editable: true,
    },
    {
      title: <b>Mail</b>,
      dataIndex: 'mail',
      key: 'mail',
      editable: true,
    },
    {
      title: <b>Status</b>,
      dataIndex: 'status',
      key: 'status',
      editable: true,
    },
    {
      title: <b>Employee Type</b>,
      dataIndex: 'employmenttype',
      key: 'employmenttype',
      editable: true,
    },
    {
      title: <b>Employee Role</b>,
      dataIndex: 'role',
      key: 'role',
      editable: true,
    },
    {
      title: <b>Manager Mail</b>,
      dataIndex: 'managermail',
      key: 'managermail',
      editable: true,
    },
    {
      title: <b>Start Date</b>,
      dataIndex: 'startdate',
      key: 'startdate',
      editable: true,
    },
    {
      title: <b>End Date</b>,
      dataIndex: 'enddate',
      key: 'enddate',
      editable: true,
    },
    {
      title: <div className="d-flex justify-content-between"><div><b>Actions</b></div>
        <div className="material-icons-outlined cursorSty mr-3" onClick={() => setModal(true)}>
          person_add
        </div></div>,
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              // onClick={() => save(record.key)}
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
                <i
                  className="fas fa-edit"
                  style={{ color: "blue" }}
                ></i>
              </Tooltip>
            </Typography.Link>
            <Typography.Link
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
        inputType: col.dataIndex === 'employmenttype' ? 'employmenttype' : (col.dataIndex === 'role' ? 'role' :
          (col.dataIndex === 'status' ? 'status':'text')),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  let modalValues = {
    fullName: fullName,
    email: email,
    empType: empType,
    empRole: empRole,
    managerMail: managerMail,
    startDate: startDate,
    endDate: endDate,
    status: status,
  }

  const handleFullname = (val) => {
    setFullName(val);
  }

  const handleMail = (val) => {
    setEmail(val);
  }

  const handlePassword = (val) => {
    setPassword(val);
  }

  const handleEmpType = (val) => {
    setEmpType(val);
  }

  const handleEmpyRole = (val) => {
    setEmpRole(val);
  }

  const handleManagerMail = (val) => {
    setManagerMail(val);
  }

  const handleStartDate = (val) => {
    setStartDate(val);
  }

  const handleEndDate = (val) => {
    setEndDate(val);
  }

  const handleStatus = (val) => {
    setStatus(val);
  }

  const ConfirmHandler = () => {
    setConfirmBtnLoader(true);
    let userDetails = {
      id: "",
      password: password,
      fullname: fullName,
      mail: email,
      employmenttype: empType,
      role: empRole,
      managermail: managerMail,
      managerid: "",
      startdate: startDate,
      enddate: endDate,
      status: status,
    };
    setTimeout(() => {
      setConfirmBtnLoader(false);
      setModal(false);
      // ProfileUpdateNotification();
    }, 2000);
  };

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
            <div className="float-right mb-4">
                {/* <Button
                type="primary mr-4"
                className="buttonStyles"
              >
                Save
              </Button> */}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
                style={{ width: "250px", fontSize: "1rem" }}
              />
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
              <PopUpModal visibility={modal} handleClose={handleClose}
                values={modalValues}
                handleFullname={handleFullname}
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
              />
          </div>
        )}
      </div>
    </section>
  );
};

export default Setup;
