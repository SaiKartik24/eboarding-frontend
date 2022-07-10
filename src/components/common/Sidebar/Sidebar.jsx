import React, { useEffect } from "react";
import { Layout, Menu, Input } from "antd";
import "./Sidebar.scss";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { resolveUserData } from "../../services/configs";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = (props) => {
  const path = window.location.pathname.split("/");
  var nlpApps = path[1];
  var pathId = path[2];
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = React.useState([]);
  const userData = resolveUserData();

  const rootMenuKeys = ["sub0", "sub1", "sub2", "sub3"];

  const onOpenChange = (keys) => {
    if (!collapsed) {
      const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
      if (rootMenuKeys.indexOf(latestOpenKey) === -1) {
        setOpenKeys(keys);
      } else {
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
    }
  };

  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    if (pathId == undefined) {
      setOpenKeys([]);
    }
  }, [location, props]);

  const navigateToNext = (app) => {
    navigate(app);
  };

  const mouseInEventHandler = (e) => {
    // setTimeout(() => {
    //   setCollapsed(false);
    // }, 1000);
    setCollapsed(false);
  };

  const mouseOutEventHandler = (e) => {
    setCollapsed(true);
  };

  const CustomAvatar = () => {
    return (
      <div
        className={
          collapsed
            ? "customAvatarCollapsed hoverStyle"
            : "customAvatar hoverStyle"
        }
      >
        <div class="material-icons-outlined ml-1 homeIcon">phonelink_setup</div>
      </div>
    );
  };

  return (
    <section
      className="sidebar"
      onMouseEnter={mouseInEventHandler}
      onMouseLeave={mouseOutEventHandler}
    >
      <Sider
        trigger={null}
        theme="light"
        collapsible
        collapsed={collapsed}
        width={240}
        className="site-layout-background h-100"
      >
        <div
          className={
            collapsed ? "logoCollapsed text-center" : "logoStyle text-center"
          }
        ></div>
        <div
          className={
            collapsed
              ? "mt-1 position-relative scrollHeight d-flex flex-column"
              : "mt-1 position-relative scrollHeight"
          }
        >
          <div className={collapsed ? "subBlockCollapsed" : "w-100"}>
            <Link to={"/itaccess"} className="linkSty">
              <div className={collapsed ? "subTitle mt-2 d-flex" : "subTitle mt-2 ml-3 d-flex" }>
                <div className={collapsed ? "fas fa-home ml-2 homeIcon" :"fas fa-home ml-1 homeIcon"}></div>
                {collapsed ? null : (
                  <div className="ml-3" style={{ marginTop: "1px" }}>
                    Home
                  </div>
                )}
              </div>
            </Link>
            {userData.role && (userData.role == "administrator" || userData.role == "Administrator") ? (
              <>
                <div
                  className={
                    collapsed
                      ? "subTitle mt-4 d-flex"
                      : "subTitle mt-3 ml-3 d-flex"
                  }
                >
                  <div className={collapsed ? "material-icons-outlined ml-2 accessIcon" :
                    "material-icons-outlined ml-1 accessIcon"}>
                    accessibility_new
                  </div>
                  {collapsed ? null : <div className="nlpSpacing">Access</div>}
                </div>
                <div
                  className={
                    collapsed ? "subTitle mt-4 d-flex" : "subTitle mt-1 d-flex"
                  }
                >
                  {collapsed ? (
                    <div className={collapsed ? "material-icons-outlined setupIcon ml-2": "material-icons-outlined"}>
                      phonelink_setup
                    </div>
                  ) : (
                    <Menu
                      key="13"
                      mode="inline"
                      className=" text-decoration-none searchMenuStyle mt-1"
                      openKeys={openKeys}
                      onOpenChange={onOpenChange}
                      style={{
                        width: 400,
                      }}
                    >
                      <SubMenu
                        // key={app.Id}
                        key={"sub"}
                        title={"Setup"}
                        icon={<CustomAvatar />}
                        className="text-decoration-none text-capitalize "
                        onTitleClick={() => navigateToNext("/itaccess/setup")}
                      >
                        <Menu.Item
                          // key={app.Id + "intents"}
                          className={collapsed ? "d-none" : "submenu-ItemStyle"}
                        >
                          Employee
                        </Menu.Item>
                        <Menu.Item
                          // key={app.Id + "entities"}
                          className={
                            collapsed
                              ? "d-none"
                              : "text-decoration-none submenu-ItemStyle"
                          }
                        >
                          Application
                        </Menu.Item>
                        <Menu.Item
                          // key={app.Id + "settings"}
                          className={
                            collapsed
                              ? "d-none"
                              : "text-decoration-none submenu-ItemStyle"
                          }
                        >
                          Template
                        </Menu.Item>
                      </SubMenu>
                    </Menu>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Sider>
    </section>
  );
};

export default Sidebar;
