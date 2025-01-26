import CustomerLayout from "../../components/layout/CustomerLayout";
import CheckOut from "../../pages/coustomer/CheckOut";
import Profile from "../../pages/coustomer/Profile";
import ViewOrder from "../../pages/coustomer/ViewOrder";

export const customerPaths = [
    {
      name: "Dashboard",
      path: "dashboard",
      element: <CustomerLayout />,
    },
    {
      name: "All management",
      children: [
        {
          name: "Profile",
          path: "profile",
          element: <Profile />,
        },
        {
          name: "Check-out",
          path: "check-out",
          element: <CheckOut/>,
        },
        {
          name: "View Order",
          path: "view-order",
          element: <ViewOrder />,
        },
      ],
    },
  ];