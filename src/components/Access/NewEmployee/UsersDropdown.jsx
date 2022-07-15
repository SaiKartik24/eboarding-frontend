import React, { useEffect, useMemo, useState, useRef } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
const { Option } = Select;
const UsersDropdown = (props) => {
  let getUsers = props.getUsers;
  let value = props.value;

  function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }

          setOptions(newOptions);
          setFetching(false);
        });
      };

      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
      <div className="d-flex">
        <Select
          labelInValue
          filterOption={false}
          onSearch={debounceFetcher}
          notFoundContent={null}
          {...props}
          options={options}
          className="selectSty"
        />
        {fetching && (
          <i className="fas fa-spinner fa-2x fa-spin spinner saveSpinner mr-2"></i>
        )}
      </div>
    );
  }

  return (
    <div
      className="debounceSelectStyle"
      style={{ width: "30%", placeSelf: "center" }}
    >
      <DebounceSelect
        mode="multiple"
        value={value}
        placeholder="Select users"
        fetchOptions={getUsers}
        onChange={(newValue) => {
          props.setValues(newValue);
        }}
        style={{
          width: "100%",
        }}
      />
    </div>
  );
};

export default UsersDropdown;
