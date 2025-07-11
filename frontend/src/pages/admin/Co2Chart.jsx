import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Co2Chart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("day");

  useEffect(() => {
    const fetchEmissions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:8080/api/admin/emission-stats?range=${range}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const now = new Date();
        let labels = [];
        let data = [];

        if (range === "day") {
          // full label (untuk mapping)
          const fullLabels = Array.from({ length: 24 }, (_, i) => {
            const d = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
            d.setMinutes(0, 0, 0);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const hh = String(d.getHours()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd} ${hh}:00:00`;
          });

          // label singkat (jam saja)
          labels = fullLabels.map((full) => full.slice(11, 16)); // ambil jam (HH:MM)

          const emissionsMap = {};
          res.data.forEach((item) => {
            emissionsMap[item.label] = parseFloat(item.total_emission);
          });

          data = fullLabels.map((label) => emissionsMap[label] || 0);
        }

        if (range === "year") {
          labels = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            return `${yyyy}-${mm}`;
          });

          const emissionsMap = {};
          res.data.forEach((item) => {
            emissionsMap[item.label] = parseFloat(item.total_emission);
          });

          data = labels.map((label) => emissionsMap[label] || 0);
        }

        setChartData({
          labels,
          datasets: [
            {
              label: "Total CO₂ Emission (kg)",
              data,
              borderColor: "#FF5733",
              backgroundColor: "rgba(255, 87, 51, 0.2)",
              tension: 0.3,
              pointRadius: 4,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error("Gagal memuat data grafik emisi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmissions();
  }, [range]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Statistics Emissions
        </h2>
        <select
          className="px-3 py-1 rounded-md border text-sm"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="day">Harian</option>
          <option value="year">Tahunan</option>
        </select>
      </div>
      <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
        {loading ? (
          <div className="text-gray-500">Loading chart...</div>
        ) : chartData.datasets[0].data.every((val) => val === 0) ? (
          <div className="text-gray-400">
            Tidak ada data emisi untuk rentang ini
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default Co2Chart;
