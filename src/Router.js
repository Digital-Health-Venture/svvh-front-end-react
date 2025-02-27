import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Review from "./pages/Review";
import Call from "./pages/Call";
import Home from "./pages/Home";
import Register from "./pages/Register";

export default function AppRouter() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/call" element={<Call />} />
        <Route path="/review" element={<Review />} />
      </Routes>
    </Router>
  );
}
