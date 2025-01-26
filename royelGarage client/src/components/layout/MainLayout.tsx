import { Button, Layout } from "antd";
import Sidebar from "./Sidebar";
import { Content, Header } from "antd/es/layout/layout";
import { Outlet } from "react-router";

const MainLayout = () => {
    // <Button onClick={handleLogout} >Logout </Button>
  
    return (
      <Layout className="h-[100%]" >
        <Sidebar />
        <Layout>
          <Header style={{ padding: 0 }} >
            <Button  >Logout </Button>
             </Header>
          <Content style={{ margin: "24px 16px 0" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  };
  
  export default MainLayout;