import React, { useEffect, useState } from "react";
import "./setup.scss";
import { Button, Form, Input, Popconfirm, Space, Table, Tag, Tooltip, Typography } from 'antd';
import * as XLSX from "xlsx";

const Setup = (props) => {
  const [form] = Form.useForm();
  const [pageLoader, setPageLoader] = useState(true);
  const [items, setItems] = useState([]);
  const [editingKey, setEditingKey] = useState("");

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

        console.log(ws)

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      d.map((item) => {
        let startDate = ExcelDateToJSDate(item.StartDate)
        item.StartDate = startDate;
        let endDate = ExcelDateToJSDate(item.EndDate)
        item.EndDate = endDate;
      })
      console.log(d);
      setItems([...items, ...d]);
    });
  };

  useEffect(() => {
    setPageLoader(true);
    setTimeout(() => {
      setPageLoader(false);
    }, 2000);
  }, [items]);

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
    console.log(editing);
    const inputNode = inputType === 'number' ? null : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          console.log(editing),
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

  const cancel = () => {
    setEditingKey("");
  };

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'FullName',
      key: 'FullName',
    },
    {
      title: 'Mail',
      dataIndex: 'Mail',
      key: 'Mail',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'status',
    },
    {
      title: 'Employee Type',
      dataIndex: 'EmployeeType',
      key: 'EmployeeType',
    },
    {
      title: 'Employee Role',
      dataIndex: 'EmployeeRole',
      key: 'EmployeeRole',
    },
    {
      title: 'Manager Mail',
      dataIndex: 'ManagerMail',
      key: 'ManagerMail',
    },
    {
      title: 'Start Date',
      dataIndex: 'StartDate',
      key: 'StartDate',
    },
    {
      title: 'End Date',
      dataIndex: 'EndDate',
      key: 'EndDate',
    },
    {
      title: <b>Actions</b>,
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
              // disabled={editingKey !== ""}
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
              // disabled={editingKey !== ""}
            >
              <Tooltip title="Delete">
                <i
                    className="fas fa-trash ml-1 mr-1"
                    style={{color:"red"}}
                ></i>
              </Tooltip>
            </Typography.Link>
          </span>
        );
      },
    },
  ];
  const isEditing = (record) => record.Mail === editingKey;
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.Mail);
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
                <Button
                  type="primary mr-4"
                  className="buttonStyles"
                >
                  Save
                </Button>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  readExcel(file);
                }}
                style={{ width: "250px", fontSize:"1rem" }}
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
                  pagination={false}
                  scroll={{
                    x: 200,
                    y: 500,
                  }}
                />
              </Form>
          </div>
        )}
      </div>
    </section>
  );
};

export default Setup;
