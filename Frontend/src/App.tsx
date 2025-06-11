import { Outlet } from "react-router-dom";
//import "./css/app.css";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      <Toaster richColors position="top-right" />

      <div className="min-h-screen flex flex-col ">
        <Header />

        <div className="flex-grow pt-20 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500">
          <Outlet />
        </div>

        <Footer />
      </div>
    </>
  );
}

export default App;
