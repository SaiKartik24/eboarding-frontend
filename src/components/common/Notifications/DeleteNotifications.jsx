import { notification } from 'antd'
import React from 'react'
import './notification.scss'
const openNotificationForDelete = (placement, msg) => {
    notification.open({
        message: <div className="notificationStyle">{msg} deleted.</div>,
        placement,
    });
};

export const recordDeleteNotification = () => {
    openNotificationForDelete("topRight", "Record")
}