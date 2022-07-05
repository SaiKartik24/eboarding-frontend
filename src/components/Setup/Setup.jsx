import React, { useEffect, useState } from "react";
import "./setup.scss";
import { Space, Table, Tag } from 'antd';
import * as XLSX from "xlsx";

const Setup = (props) => {

  const [pageLoader, setPageLoader] = useState(true);
  const [items, setItems] = useState([]);
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
      setItems(d);
    });
  };



  useEffect(() => {
    setPageLoader(true);
    setTimeout(() => {
      setPageLoader(false);
    }, 2000);
  }, []);

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
  ];
  
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
            <div>
              <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
            </div>
              <Table columns={columns} dataSource={items} />
              </div>
        )}
      </div>
    </section>
  );
};

export default Setup;
