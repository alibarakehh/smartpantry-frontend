import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Aboutus from "./pages/aboutus";
import SearchView from "./pages/SearchView";
import Shuffle from "./pages/shuffle";
import SearchV from "./pages/SearchView";
import PantryPage from "./pages/PantryPage";   // ← NEW
import { AuthProvider } from "./contexts/AuthContext";

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="aboutus" element={<Aboutus />} />
      
        <Route path="pantry" element={<PantryPage />} />

        <Route path="search" element={<SearchView />} />
        <Route path="shuffle" element={<Shuffle />} />
        <Route path="SearchView" element={<SearchV />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  </AuthProvider>
);

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
