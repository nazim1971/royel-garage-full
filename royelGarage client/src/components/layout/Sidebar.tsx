import Sider from "antd/es/layout/Sider";
import { adminPaths } from "../../routes/admin/AdminPaths";
import { customerPaths } from "../../routes/customer/CustomerPaths";
import { menuGenerator } from "../../utils/sidebarMenuGeneratoe";
import { Menu } from "antd";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

const userRole = {
    ADMIN: "admin",
    CUSTOMER: "customer"
  };
  
  const Sidebar = () => {
    // Fetch the current user
    const user = useAppSelector(selectCurrentUser);
  
    let sidebarItems;

    // Default to empty string if the role is undefined
    const role = user?.role || "";
  
    switch (role) {
      case userRole.ADMIN:
        console.log("Generating sidebar for Admin role");
        sidebarItems = menuGenerator(adminPaths, userRole.ADMIN);  // Admin paths
        break;
      case userRole.CUSTOMER:
        console.log("Generating sidebar for Customer role");
        sidebarItems = menuGenerator(customerPaths, userRole.CUSTOMER);  // Customer paths
        break;
      default:
        console.log("No role, generating default menu");
        sidebarItems = menuGenerator([], null);  // Fallback case with no role-based routes
        break;
    }
  
  
    return (
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div
          style={{
            color: "white",
            height: "4 rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ textAlign: 'center' , marginTop: '10px'}} >Royal garage</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={sidebarItems}
        />
      </Sider>
    );
  }
  
  export default Sidebar