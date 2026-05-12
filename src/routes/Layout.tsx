import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import VerificationHeader from "@/components/VerificationHeader";

const Layout = () => {
  return (
    <>
    <div className="min-h-screen">
      <NavBar />
      <VerificationHeader />
      <main>
        <Outlet />
      </main>
    </div>
      <Footer />
    </>
  );
};

export default Layout;
