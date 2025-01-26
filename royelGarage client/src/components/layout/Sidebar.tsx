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
  
    const user = useAppSelector(selectCurrentUser)
  
     //const role = "admin";
     let sidebarItems;
  
     switch (user!.role) {
       case userRole.ADMIN:
         sidebarItems = menuGenerator(adminPaths, userRole.ADMIN);
         break;
       case userRole.CUSTOMER:
         sidebarItems = menuGenerator(customerPaths, userRole.CUSTOMER);
         break;
       default:
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