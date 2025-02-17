import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Review from "./pages/Review";
import Call from "./pages/Call";

export default function AppRouter() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/review" element={<Review />} />
        <Route path="/call" element={<Call />} />
      </Routes>
    </Router>
  );
}
