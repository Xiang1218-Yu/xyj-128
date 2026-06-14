import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { useTheme } from "@/hooks/useTheme";

function AppContent() {
  useTheme();
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
