import { NavLink } from "react-router";
import { TRoutePaths, TSidebarItem } from "../types/sidebar.types";

// Default public routes without role
const defaultRoutes: TRoutePaths[] = [
  { path: " ", name: "Home" },
  { path: "about", name: "About Us" },
  { path: "all-products", name: "All-products" },
];

// Menu generator function to generate menu items
export const menuGenerator = (roleRoutes: TRoutePaths[], role: string | null) => {
  
  // Function to generate menu items from routes
  const generateMenuItems = (routes: TRoutePaths[], addRolePrefix: boolean) => {
    return routes.reduce((acc: TSidebarItem[], item) => {
      if (item.path && item.name) {
        acc.push({
          key: item.name,
          label: (
            <NavLink to={addRolePrefix ? `/${role}/${item.path}` : `/${item?.path}`}>
              {item.name}
            </NavLink>
          ),
        });
      }

      if (item.children) {
        acc.push({
          key: item.name,
          label: item.name,
          children: item.children.map((child) => ({
            key: child.name,
            label: (
              <NavLink to={addRolePrefix ? `/${role}/${child.path}` : `/${child.path}`}>
                {child.name}
              </NavLink>
            ),
          })),
        });
      }

      return acc;
    }, []);
  };

  // Generate menu items for default (public) routes without role prefix
  const publicRoutesMenu = generateMenuItems(defaultRoutes, false);

  // Generate menu items for role-specific routes with role prefix
  const roleRoutesMenu = role ? generateMenuItems(roleRoutes, true) : [];

  // Combine both public and role-specific routes
  return [...publicRoutesMenu, ...roleRoutesMenu];
};
