import React, { useState } from "react";
import Sider from "antd/es/layout/Sider";
import { adminPaths } from "../../routes/admin/AdminPaths";
import { customerPaths } from "../../routes/customer/CustomerPaths";
import { menuGenerator } from "../../utils/sidebarMenuGeneratoe";
import { Menu, Button } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { CloseOutlined, MenuUnfoldOutlined } from "@ant-design/icons"; // Icons for toggling

const userRole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

const Sidebar = () => {
  // State to control sidebar visibility
  const [visible, setVisible] = useState(false);

  // Fetch the current user
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role || ""; // Default to empty string if the role is undefined

  let sidebarItems;

  switch (role) {
    case userRole.ADMIN:
      console.log("Generating sidebar for Admin role");
      sidebarItems = menuGenerator(adminPaths, userRole.ADMIN);
      break;
    case userRole.CUSTOMER:
      console.log("Generating sidebar for Customer role");
      sidebarItems = menuGenerator(customerPaths, userRole.CUSTOMER);
      break;
    default:
      console.log("No role, generating default menu");
      sidebarItems = menuGenerator([], null); // Fallback case with no role-based routes
      break;
  }

  return (
    <>
      {/* Button to toggle the sidebar */}
      <Button
        type="primary"
        style={{ position: "fixed", top: 20, left: 20, zIndex: 1000 }} // Ensure button stays on top
        onClick={() => setVisible(!visible)}
        icon={visible ? <CloseOutlined /> : <MenuUnfoldOutlined />} // Switch icons based on visibility
      >
        {visible ? "Close Sidebar" : "Open Sidebar"}
      </Button>

      {/* Sidebar component */}
      {visible && (
        <Sider
          width={250} // Set a fixed width for the sidebar
          style={{
            backgroundColor: "#001529",
            height: "100vh", // Full height sidebar
            zIndex: 999, // Ensure sidebar appears on top
            transition: "transform 0.3s ease-in-out",
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
      )}
    </>
  );
};

export default Sidebar;
