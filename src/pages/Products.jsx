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

  const productRef = collection(db, "products");
  const trxRef = collection(db, "transactions");

  // ✅ realtime ambil produk
  useEffect(() => {
    const unsub = onSnapshot(productRef, (snap) => {
      setProducts(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))
      );
    });

    return () => unsub();
  }, []);

  // ✅ jual produk
  const sellProduct = async (p) => {
    if (p.stock <= 0) return alert("Stok habis!");

    // kurangi stok
    await updateDoc(doc(db, "products", p.id), {
      stock: p.stock - 1
    });

    // simpan transaksi
    await addDoc(trxRef, {
      productId: p.id,
      name: p.name,
      price: p.price,
      qty: 1,
      total: p.price,
      createdAt: Date.now()
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>🛒 POS Kasir</h2>

      {products.map(p => (
        <div key={p.id} style={{
          border: "1px solid #ccc",
          padding: 10,
          marginBottom: 10
        }}>
          <b>{p.name}</b>
          <br />
          Harga: Rp {p.price}
          <br />
          Stok: {p.stock}
          <br /><br />

          <button onClick={() => sellProduct(p)}>
            ➖ Jual 1
          </button>
        </div>
      ))}
    </div>
  );
}
