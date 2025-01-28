import AdminLayout from "../../components/layout/AdminLayout";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import ManageOrders from "../../pages/admin/ManageOrders";
import ManageProducts from "../../pages/admin/ManageProducts";
import ManageUsers from "../../pages/admin/ManageUsers";

export const adminPaths = [
  {
    name: "Dashboard",
    path: "",
    element: <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>,
    children: [
      {
        name: "Manage Orders",
        path: "manage-orders",
        element: <ProtectedRoute><ManageOrders /></ProtectedRoute>,
      },
      {
        name: "Manage Products",
        path: "manage-products",
        element: <ProtectedRoute>
          <ManageProducts/>
        </ProtectedRoute>,
      },
      {
        name: "Manage Users",
        path: "manage-users",
        element: <ProtectedRoute><ManageUsers /></ProtectedRoute>,
      },
    ],
  },
 
];
