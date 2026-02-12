import { Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Products from "./pages/Products";
import POS from "./pages/POS";
import Admin from "./pages/Admin";

function Layout({ children, title }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>{title}</h1>

      <nav style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Link to="/">Shop</Link>
        <Link to="/pos">POS</Link>
        <Link to="/products">Products</Link>
        <Link to="/admin">Owner</Link>
        <Link to="/login">Login</Link>
      </nav>

      {children}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <Layout title="🛒 Shop Online">
            <p>Welcome Zhu POS SaaS 🚀</p>
          </Layout>
        }
      />

      {/* POS */}
      <Route
        path="/pos"
        element={
          <Layout title="💳 POS Kasir">
            <POS />
          </Layout>
        }
      />

      {/* PRODUCTS */}
      <Route
        path="/products"
        element={
          <Layout title="📦 Produk Manager">
            <Products />
          </Layout>
        }
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          <Layout title="🔐 Login">
            <Login />
          </Layout>
        }
      />

        <Route
          path="/admin"
          element={
            <Layout title="👑 Owner Dashboard">
              <Admin />
            </Layout>
        }
      />

    </Routes>
  );
}
