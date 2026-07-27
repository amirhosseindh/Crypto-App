import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/NavBar";
import Home from "./components/Home";
import Landing from "./components/Landing";
import CoinDetail from "./components/CoinDetail";
import Trade from "./components/Trade";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coins" element={<Landing />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
