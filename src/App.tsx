import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("./pages/Home.tsx"));
const Navbar = lazy(() => import("./components/Navbar/Navbar.tsx"));
const GoogleLoginPage = lazy(() => import("./pages/GoogleLoginPage.tsx"));

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/user/dashboard"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route path="/" element={<GoogleLoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
