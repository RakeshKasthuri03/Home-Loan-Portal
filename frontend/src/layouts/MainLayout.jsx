import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import Footer from "@components/Footer";

// Main layout component that wraps all pages with a consistent header and footer.
// Uses React Router's Outlet to render the matched child route's component.
const MainLayout = () => {
  return (
    // Fragment to avoid adding an unnecessary wrapper element to the DOM
    <>
      {/* Site-wide header, rendered at the top of every page */}
      <Header />
      {/* Main content area where the current route's component is rendered */}
      <main>
        {/* Outlet renders the child route element matched by the current URL */}
        <Outlet />
      </main>
      {/* Site-wide footer, rendered at the bottom of every page */}
      <Footer />
    </>
  );
};

export default MainLayout;
