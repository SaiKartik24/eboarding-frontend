import { notification } from "antd";
import React from "react";
import "./notification.scss";
const openNotificationForRequest = (placement, msg) => {
  notification.open({
    message: <div className="notificationStyle">{msg} requested.</div>,
    placement,
  });
};

export const ShareTemplateNotification = () => {
  openNotificationForRequest("topRight", "Successfully");
};
