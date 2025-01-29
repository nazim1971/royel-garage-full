import CustomerLayout from "../../components/layout/CustomerLayout";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import CheckOut from "../../pages/coustomer/CheckOut";
import Profile from "../../pages/coustomer/Profile";
import ViewOrder from "../../pages/coustomer/ViewOrder";

export const customerPaths = [
    {
      name: "Dashboard",
      path: "",
      element: <ProtectedRoute>
        <CustomerLayout />
      </ProtectedRoute>,
      children: [
        {
          name: "Profile",
          path: "profile",
          element: <ProtectedRoute><Profile /></ProtectedRoute>,
        },
        {
          name: "Check-out",
          path: "check-out/:id",
          element: <ProtectedRoute>
            <CheckOut/>
          </ProtectedRoute>,
        },
        {
          name: "View Order",
          path: "view-order",
          element: <ProtectedRoute><ViewOrder /></ProtectedRoute>,
        },
      ],
      
    }
   
  ];