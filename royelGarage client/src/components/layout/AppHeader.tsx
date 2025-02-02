import React from "react";
import { Layout, Button, Image, Flex } from "antd";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logout, TUser } from "../../redux/features/auth/authSlice";
import { NavLink, useNavigate } from "react-router";
import { verifyToken } from "../../utils/verifyToken";

const { Header } = Layout;

const AppHeader: React.FC<{ setSidebarVisible: (visible: boolean) => void }> = ({ setSidebarVisible }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token) as string
  const decodeT = verifyToken(token) as TUser
  const navigate = useNavigate();

  const handleDashboardClick = async() => {
   
    navigate(`/${decodeT?.role}`); // Navigate to the dashboard
     setSidebarVisible(true); // Open the sidebar
  };


  const handleLogout = () => {
    dispatch(logout());
  };



  return (
    <Header style={{ backgroundColor: "#001529", padding: 0 }}>
      <Flex justify="space-between" style={{ padding: "0 20px" }}>
        {/* Logo and Nav */}
        <Flex align="center" gap={20}>
          <NavLink to="/">
            <Image
              height={60}
              preview={false}
              style={{ borderRadius: "50%" }}
              src="https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738346961/Black_Retro_Motorcycle_Circle_Logo_1_tuxsuh.png"
              alt="Logo"
            />
          </NavLink>

          {/* Navigation Links */}
          <NavLink to="/">
            <Button type="link" style={{ color: "#fff", fontSize: "16px" }}>
              Home
            </Button>
          </NavLink>
          <NavLink to="/about">
            <Button type="link" style={{ color: "#fff", fontSize: "16px" }}>
              About
            </Button>
          </NavLink>
          <NavLink to="/all-products">
            <Button type="link" style={{ color: "#fff", fontSize: "16px" }}>
              All Products
            </Button>
          </NavLink>
          {
            token &&  <Button type="link" style={{ color: "#fff", fontSize: "16px" }} onClick={handleDashboardClick}>
            Dashboard
          </Button>
          }
        </Flex>

        {/* Auth Section */}
        <Flex align="center" gap={20}>
          {token ? (
           <Button  style={{ color: "#000", fontSize: "16px", backgroundColor: 'white' }}  type="text" onClick={handleLogout}>
           Logout
         </Button>
          ) : (
            <Flex gap={10}>
              <Button
                href="/login"
                type="default"
                shape="round"
                style={{ fontWeight: 600 }}
              >
                Login
              </Button>
              <Button
                href="/register"
                type="primary"
                shape="round"
                style={{ fontWeight: 600 }}
              >
                Register
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Header>
  );
};

export default AppHeader;
