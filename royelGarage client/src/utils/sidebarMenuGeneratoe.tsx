import { NavLink } from "react-router";
import { TRoutePaths, TSidebarItem } from "../types/sidebar.types";

// Default routes without role
const defaultRoutes: TRoutePaths[] = [
  { path: "", name: "Home" },
  { path: "about", name: "About Us" },
  { path: "product-details", name: "Product-details" },
  { path: "all-products", name: "All-products" },
];

// Menu generator function to generate menu items
export const menuGenerator = (roleRoutes: TRoutePaths[], role: string | null) => {
  const combinedRoutes = [
    ...defaultRoutes,  // Default routes
    ...roleRoutes      // Role-specific routes
  ];

  const routes = combinedRoutes.reduce((acc: TSidebarItem[], item) => {
    if (item.path && item.name) {
      acc.push({
        key: item.name,
        label: <NavLink to={role ? `/${role}/${item.path}` : `/${item.path}`}>{item.name}</NavLink>,
      });
    }

    if (item.children) {
      acc.push({
        key: item.name,
        label: item.name,
        children: item.children.map((child) => ({
          key: child.name,
          label: <NavLink to={`/${role}/${child.path}`}>{child.name}</NavLink>,
        })),
      });
    }

    return acc;
  }, []);

  return routes;
};
