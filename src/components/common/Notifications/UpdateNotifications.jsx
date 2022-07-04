import { notification } from 'antd'
import React from 'react'
import './notification.scss'
const openNotificationForUpdate = (placement) => {
    notification.open({
        message: <div className="notificationStyle">Profile updated</div>,
        placement,
    });
};
const ProfileUpdateNotification = () =>
    openNotificationForUpdate("topRight")
export default ProfileUpdateNotification