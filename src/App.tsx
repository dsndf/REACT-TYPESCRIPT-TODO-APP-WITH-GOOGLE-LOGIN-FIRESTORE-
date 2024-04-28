import Home from "./pages/Home.tsx";
import { Route, Routes } from "react-router-dom";
import GoogleLoginPage from "./pages/GoogleLoginPage.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
            <Navbar/>
              <Home />
            </>
          }
        />
        <Route path="/google/login" element={<GoogleLoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
