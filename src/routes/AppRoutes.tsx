import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import Login from "../pages/Login/Login";

const AppRoutes = () => {
    return (
    <BrowserRouter>
      <Routes>
        <Route path= "/" element={<LandingPage/>}/>
        <Route path= "/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
    )
}

export default AppRoutes;