import { Layout } from "antd";
import Sidebar from "./Sidebar";
import { Content,   } from "antd/es/layout/layout";
import {  Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { useState } from "react";

const MainLayout = () => {

  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />
      <Layout>

        <AppHeader setSidebarVisible={setSidebarVisible} />
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <AppFooter/>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
