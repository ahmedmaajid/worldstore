import AdminRoutes from "./routes/AdminRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import Nav from "./components/client/Navbar";
import Sidebar from "./components/client/Sidebar";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  return (
    <BrowserRouter>
      <Nav openSidebar={openSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <AdminRoutes />
      <ClientRoutes openSidebar={openSidebar} />
    </BrowserRouter>
  );
}

export default App;
