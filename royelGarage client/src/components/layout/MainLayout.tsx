import { Button, Layout } from "antd";
import Sidebar from "./Sidebar";
import { Content, Header } from "antd/es/layout/layout";
import { Outlet } from "react-router";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/features/auth/authSlice";

const MainLayout = () => {
    const  dispatch = useAppDispatch();
   
  const handleLogout = () =>{
    dispatch(logout())
  }
  
    return (
      <Layout style={{minHeight: '100vh'}} >
        <Sidebar />
        <Layout>
          <Header style={{ padding: 0 }} >
            <Button onClick={handleLogout} >Logout </Button>
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