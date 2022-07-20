import { notification } from "antd";
import React from "react";
import "./notification.scss";
const openNotificationForNoEmployee = (placement) => {
  notification.open({
    message: <div className="notificationStyle">No Record Found.</div>,
    placement,
  });
};

export const NoEmployeeNotification = () => {
  openNotificationForNoEmployee("topRight");
};
