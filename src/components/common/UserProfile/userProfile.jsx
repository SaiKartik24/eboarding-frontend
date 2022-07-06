/* eslint-disable jsx-a11y/anchor-is-valid */

// This component is for User Profile in the Topbar
import React, { Component } from "react";
import { useEffect, useState } from "react";
import "./userProfile.scss";
import { Menu, Avatar, Dropdown } from "antd";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
const customErrorMessage = "Something went wrong, Please refresh the page.";
const userLogo = {
  margin: "0 8px 0px 0px",
  textTransform: "uppercase",
};

const UserProfile = (props) => {
  const data = props.userData;
  // console.log(data);
  const navigate = useNavigate();
  const [profileImag, setProfileImg] = useState("");
  const profile = () => {
    // navigate("/apps/usersettings");
  };

  useEffect(() => {
    ProfileImage();
  });
  const ProfileImage = () => {
    let profileName = data.fullname && data.fullname.split(" ");
    // console.log(data)
    if (profileName.length > 1) {
      profileName = profileName[0].charAt(0) + profileName[1].charAt(0);
    }
    else {
      profileName = profileName[0].charAt(0) + profileName[0].charAt(1);
    }
    setProfileImg(profileName);
  };

  const CustomAvatar = (props) => {
    return (
      <div className="profile">
        <div className={"customAvatar hoverStyle profileName"}>
          <span className={"position-relative spanStyle"}>
            {profileImag.toUpperCase()}
          </span>
        </div>
        <span className="white text-capitalize userName">
          {data.fullname}
        </span>
        <Dropdown
          overlay={() => menu(resolveFirstName(data.fullname))}
          trigger={["click"]}
        >
          <a className="ant-dropdown-link " onClick={(e) => e.preventDefault()}>
            <span className="fa fa-fw fa-caret-down white"></span>
          </a>
        </Dropdown>
      </div>
    );
  };

  const menu = (firstName) => {
    return (
      <Menu className="userProfile">
          <Menu.Item key="3" onClick={profile}>
            <span className="topbarStyle">
            <span class="material-icons-outlined profileIcon">
              account_circle
            </span>
            <span>&nbsp; Profile</span>
            </span>
          </Menu.Item>
        <Menu.Item key="4" onClick={() => {
          localStorage.removeItem("userData");
          navigate("/")
        }}>
          <span className="topbarStyle">
            <i className="fa fa-sign-out"></i>
            &nbsp; Logout
          </span>
        </Menu.Item>
      </Menu>
    );
  };

  const resolveFirstName = (name) => {
    let splitFirstname = name.split(" ")[0];
    return splitFirstname;
  };

  return (
    <section className="userProfile">
      <span
        className="white"
        style={{
          verticalAlign: "middle",
          fontSize: "1rem",
          fontWeight: "600",
        }}
      >
          <CustomAvatar name={profileImag} />
      </span>
    </section>
  );
};

export default UserProfile;
