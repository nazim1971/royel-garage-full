import React, {  useEffect } from "react";
import Sider from "antd/es/layout/Sider";
import { adminPaths } from "../../routes/admin/AdminPaths";
import { customerPaths } from "../../routes/customer/CustomerPaths";
import { menuGenerator } from "../../utils/sidebarMenuGeneratoe";
import { Menu, Button } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { CloseOutlined, MenuUnfoldOutlined } from "@ant-design/icons"; // Icons for toggling
import { useLocation } from "react-router";

const userRole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

const Sidebar:  React.FC<{ visible: boolean; setVisible: (visible: boolean) => void }> = ({ visible, setVisible }) => {


  // Fetch the current user
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role || ""; // Default to empty string if the role is undefined

  let sidebarItems;

  switch (role) {
    case userRole.ADMIN:
      sidebarItems = menuGenerator(adminPaths, userRole.ADMIN);
      break;
    case userRole.CUSTOMER:
      sidebarItems = menuGenerator(customerPaths, userRole.CUSTOMER);
      break;
    default:
      sidebarItems = menuGenerator([], null); // Fallback case with no role-based routes
      break;
  }

  const location = useLocation(); // To detect route changes

  // Close sidebar when route changes
  useEffect(() => {
    setVisible(false); // Close sidebar on route change
  }, [location]);

  // Close sidebar when clicking on the overlay
  const handleOverlayClick = () => {
    setVisible(false);
  };

  return (
    <>
      {/* Button to toggle the sidebar */}
      <Button
        type="primary"
        style={{ position: "absolute", top: 20, left: 20, zIndex: 1000 }}
        onClick={() => setVisible(!visible)}
        icon={visible ? <CloseOutlined /> : <MenuUnfoldOutlined />}
      >
        {visible ? "Close Sidebar" : "Open Sidebar"}
      </Button>

      {/* Overlay */}
      {visible && (
        <div
          onClick={handleOverlayClick}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
            zIndex: 998, // Overlay below sidebar
          }}
        />
      )}

      {/* Sidebar component */}
      <Sider
        width={250} // Set a fixed width for the sidebar
        style={{
          position: 'absolute',
          backgroundColor: "#001529",
          height: "100vh", // Full height sidebar
          zIndex: 999, // Ensure sidebar appears on top
          transform: visible ? "translateX(0)" : "translateX(-100%)", // Smooth transition for opening/closing
          transition: "transform 0.3s ease-in-out", // Add transition for smooth sliding
        }}
      >
        {/* Header section with optional logo or title */}
        <div
          style={{
            color: "white",
            padding: "20px",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Royal Garage
        </div>

        {/* Sidebar menu */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={sidebarItems}
          style={{ border: "none" }} // Clean up borders
        />
      </Sider>
    </>
  );
};

export default Sidebar;
