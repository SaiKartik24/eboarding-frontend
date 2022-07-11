import React from "react";
import { Select } from "antd";
const { Option } = Select;

const ApplicationSelect = (props) => {
  var defaultVal = props.type === "type" ? props.field.type : (props.type === "env" ? props.field.env : null)
  const onChange = (e) => {
    if (props.type === "type") {
      props.field.type = e;
    }
    else if (props.type === "env") {
      props.field.env = e;
    }
    else {
      console.log(e);
    }
  };
  return (
    <Select
      defaultValue={defaultVal}
      onChange={(e) => {
        onChange(e);
      }}
    >
      <Option value={props.values[0]}>{props.values[0]}</Option>
      <Option value={props.values[1]}>{props.values[1]}</Option>
      {props.type === "env" && <Option value={props.values[2]}>{props.values[2]}</Option>}
    </Select>
  );
};

export default ApplicationSelect;
