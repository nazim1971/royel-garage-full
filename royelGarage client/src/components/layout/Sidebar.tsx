import React, { useState } from "react";
import Sider from "antd/es/layout/Sider";
import { adminPaths } from "../../routes/admin/AdminPaths";
import { customerPaths } from "../../routes/customer/CustomerPaths";
import { menuGenerator } from "../../utils/sidebarMenuGeneratoe";
import { Menu, Button } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

const userRole = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

const Sidebar = ({ visible, setVisible }: { visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
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

  return (
    <>
      {/* Sidebar component */}
      {visible && (
        <Sider
          width={250} // Set a fixed width for the sidebar
          style={{
            backgroundColor: "#001529",
            height: "100vh", 
            position: "fixed",  // Fix it to the side of the screen
            zIndex: 9999, // Make sure it’s on top of other content
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
