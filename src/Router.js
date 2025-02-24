import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Review from "./pages/Review";
import Call from "./pages/Call";
import Home from "./pages/Home";

export default function AppRouter() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/review" element={<Review />} />
        <Route path="/call" element={<Call />} />
      </Routes>
    </Router>
  );
}
