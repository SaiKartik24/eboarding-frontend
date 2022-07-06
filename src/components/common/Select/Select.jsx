import React from 'react'
import { Select } from 'antd';
const { Option } = Select;

const SelectFun = (props) => {
    var defaultVal = props.type === "EmployeeType" ? props.field.EmployeeType :
        (props.type === "EmployeeRole" ? props.field.EmployeeRole : props.field.Status);
    const onChange = (e) => {
        defaultVal = e;
    }
    return (
        <Select
            defaultValue={defaultVal}
            onChange={(e) => { onChange(e) }}
        >
            <Option value={props.values[0]}>{props.values[0]}</Option>
            <Option value={props.values[1]}>
                {props.values[1]}
            </Option>
            <Option value={props.values[2]}>{props.values[2]}</Option>
        </Select>
    )
}

export default SelectFun