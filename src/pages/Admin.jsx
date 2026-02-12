import { useEffect, useState, useMemo } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Admin() {
  const [trx, setTrx] = useState([]);
  const [selected, setSelected] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // =========================
  // 🔥 REALTIME FIRESTORE
  // =========================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transactions"), (snap) => {
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      setTrx(data.reverse());
    });

    return () => unsub();
  }, []);

  // =========================
  // 🔹 FILTER TANGGAL
  // =========================
  const filtered = useMemo(() => {
    return trx.filter(t => {
      if (!startDate && !endDate) return true;

      const d = new Date(t.createdAt);

      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate + " 23:59")) return false;

      return true;
    });
  }, [trx, startDate, endDate]);

  // =========================
  // 🔹 TOTAL
  // =========================
  const revenue = filtered.reduce((sum, t) => sum + t.total, 0);

  // =========================
  // 🔹 HARIAN
  // =========================
  const daily = useMemo(() => {
    const map = {};

    filtered.forEach(t => {
      const date = new Date(t.createdAt).toLocaleDateString();
      map[date] = (map[date] || 0) + t.total;
    });

    return map;
  }, [filtered]);

  // =========================
  // 🔹 BULANAN
  // =========================
  const monthly = useMemo(() => {
    const map = {};

    filtered.forEach(t => {
      const d = new Date(t.createdAt);
      const key = `${d.getMonth() + 1}/${d.getFullYear()}`;
      map[key] = (map[key] || 0) + t.total;
    });

    return map;
  }, [filtered]);

  // =========================
  // 🔹 EXPORT EXCEL
  // =========================
  const exportExcel = () => {
    const rows = filtered.map(t => ({
      Tanggal: new Date(t.createdAt).toLocaleString(),
      Total: t.total,
      Items: (t.items || [])
        .map(i => `${i.name} x${i.qty}`)
        .join(", ")
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, "laporan-pos.xlsx");
  };

  // =========================
  // 🔹 CHART DATA
  // =========================
  const dailyChart = {
    labels: Object.keys(daily),
    datasets: [{ label: "Harian", data: Object.values(daily) }]
  };

  const monthlyChart = {
    labels: Object.keys(monthly),
    datasets: [{ label: "Bulanan", data: Object.values(monthly) }]
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>👑 Owner Dashboard</h2>

      <h3>Total transaksi: {filtered.length}</h3>
      <h3>Total revenue: Rp {revenue}</h3>

      <hr />

      {/* ================= FILTER ================= */}
      <h3>📅 Filter Tanggal</h3>

      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        style={{ marginLeft: 10 }}
      />

      <button
        onClick={exportExcel}
        style={{ marginLeft: 20 }}
      >
        📥 Export Excel
      </button>

      <hr />

      {/* ================= CHART HARIAN ================= */}
      <h3>📊 Grafik Harian</h3>
      <div style={{ width: 600 }}>
        <Bar data={dailyChart} />
      </div>

      <hr />

      {/* ================= CHART BULANAN ================= */}
      <h3>📈 Grafik Bulanan</h3>
      <div style={{ width: 600 }}>
        <Line data={monthlyChart} />
      </div>

      <hr />

      {/* ================= LIST TRANSAKSI ================= */}
      <h3>📋 Transaksi</h3>

      {filtered.map(t => (
        <div
          key={t.id}
          onClick={() => setSelected(t)}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 8,
            cursor: "pointer"
          }}
        >
          🧾 Rp {t.total}
        </div>
      ))}

      {/* ================= DETAIL ================= */}
      {selected && (
        <>
          <hr />
          <h3>Detail</h3>

          {(selected.items || []).map(i => (
            <div key={i.id}>
              {i.name} x{i.qty}
            </div>
          ))}

          <b>Total: Rp {selected.total}</b>
        </>
      )}
    </div>
  );
}
