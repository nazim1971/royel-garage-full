import { Col, Layout, Row } from "antd";
import Sidebar from "./Sidebar";
import { Content, Footer,  } from "antd/es/layout/layout";
import {  Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const MainLayout = () => {

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>

        <AppHeader/>
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
