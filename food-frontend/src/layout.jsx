import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./homeComponent/Navbar";

function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/login",
    "/signup",
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(
    location.pathname
  );

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
}

export default Layout;