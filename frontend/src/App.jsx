import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import ModelSetupPage from "./pages/ModelSetupPage.jsx";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/modelSetup" element={<ModelSetupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
