import React, { useState } from "react";
import { Layout, Button, Image, Flex } from "antd";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/features/auth/authSlice";
import {  MenuOutlined } from "@ant-design/icons"; // Import MenuOutlined for the hamburger icon
import { NavLink } from "react-router";
// Correct import for NavLink

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const [visible, setVisible] = useState(false); // State to control the sidebar visibility

  const handleLogout = () => {
    dispatch(logout());
  };

  // Toggle the sidebar
  const toggleSidebar = () => {
    setVisible(!visible);
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

          {/* Hamburger Icon */}
          <Button
            className="hamburger-icon"
            type="text"
            style={{ color: "#fff", fontSize: "20px" }}
            icon={<MenuOutlined />}
            onClick={toggleSidebar} // Toggle sidebar on click
          />
        </Flex>

        {/* Auth Section */}
        <Flex align="center" gap={20}>
          {token ? (
            <Button
              style={{ color: "#000", fontSize: "16px", backgroundColor: "white" }}
              type="text"
              onClick={handleLogout}
            >
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
