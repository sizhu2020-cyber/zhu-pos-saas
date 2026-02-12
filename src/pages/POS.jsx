import { db } from "../services/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [lastTrx, setLastTrx] = useState(null);

  // 🔥 realtime products
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  // ➕ tambah ke cart
  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === product.id);

      if (exist) {
        return prev.map(p =>
          p.id === product.id
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };

  // 💰 total
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // 💳 checkout
  const checkout = async () => {
    if (cart.length === 0) return;

    const trx = {
      items: cart,
      total,
      createdAt: Date.now()
    };

    // 1️⃣ simpan transaksi
    await addDoc(collection(db, "transactions"), trx);

    // 2️⃣ kurangi stok
    for (const item of cart) {
      await updateDoc(doc(db, "products", item.id), {
        stock: item.stock - item.qty
      });
    }

    setLastTrx(trx);
    setCart([]);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🛍 Produk</h2>

      {products.map(p => (
        <div key={p.id}>
          <b>{p.name}</b> | Rp {p.price} | stok: {p.stock}

          <button
            onClick={() => addToCart(p)}
            disabled={p.stock <= 0}
            style={{ marginLeft: 10 }}
          >
            ➕ Tambah
          </button>
        </div>
      ))}

      <hr />

      <h2>🛒 Keranjang</h2>

      {cart.map(c => (
        <div key={c.id}>
          {c.name} x {c.qty} = Rp {c.price * c.qty}
        </div>
      ))}

      <h3>Total: Rp {total}</h3>

      <button onClick={checkout}>💳 Bayar</button>

      {/* 🧾 Receipt */}
      {lastTrx && (
        <div
          style={{
            marginTop: 40,
            border: "1px dashed black",
            padding: 20,
            width: 300
          }}
        >
          <h3>🧾 STRUK</h3>

          {lastTrx.items.map(i => (
            <div key={i.id}>
              {i.name} x{i.qty} = Rp {i.price * i.qty}
            </div>
          ))}

          <hr />

          <b>Total: Rp {lastTrx.total}</b>

          <br /><br />

          <button onClick={() => window.print()}>
            🖨 Print
          </button>
        </div>
      )}
    </div>
  );
}
