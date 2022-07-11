import { notification } from 'antd'
import React from 'react'
import './notification.scss'
const openNotificationForRequiredField = (placement) => {
    notification.open({
        message: <div className="notificationStyle">Please fill all the fields or upload excel file.</div>,
        placement,
    });
};
export const AddEmployeeRequiredNotification = () =>{
    openNotificationForRequiredField("topRight")
}

export const AddApplicationRequiredNotification = () => {
    openNotificationForRequiredField("topRight")
}