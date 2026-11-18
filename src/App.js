import "./styles.css";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import { Entries } from "./pages/Entries";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav style={{ marginBottom: 16 }}>
          <Link to="/" style={{ marginRight: 12 }}>
            Home
          </Link>
          <Link to="/entries">Entries</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="*" element={<div>route not found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
