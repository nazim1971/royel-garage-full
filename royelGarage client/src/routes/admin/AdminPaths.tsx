import AdminLayout from "../../components/layout/AdminLayout";
import ManageOrders from "../../pages/admin/ManageOrders";
import ManageProducts from "../../pages/admin/ManageProducts";
import ManageUsers from "../../pages/admin/ManageUsers";

export const adminPaths = [
  {
    name: "Dashboard",
    path: "dashboard",
    element: <AdminLayout />,
  },
  {
    name: "All management",
    children: [
      {
        name: "Manage Orders",
        path: "manage-orders",
        element: <ManageOrders />,
      },
      {
        name: "Manage Products",
        path: "manage-products",
        element: <ManageProducts/>,
      },
      {
        name: "Manage Users",
        path: "manage-users",
        element: <ManageUsers />,
      },
    ],
  },
];
