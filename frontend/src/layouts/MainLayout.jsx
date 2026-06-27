import { Outlet } from "react-router-dom";
import Header from "@components/Header";
import Footer from "@components/Footer";

// Main layout component that wraps all pages with a consistent header and footer.
// Uses React Router's Outlet to render the matched child route's component.
const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
