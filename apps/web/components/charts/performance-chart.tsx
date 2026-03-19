"use client";

import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function PerformanceChart({ labels, values, title }: { labels: string[]; values: number[]; title: string }) {
  return (
    <div className="card p-6">
      <h3 className="mb-4 text-lg font-bold">{title}</h3>
      <Bar data={{ labels, datasets: [{ label: title, data: values, backgroundColor: ["#0f766e", "#b78a2c", "#1f4f63", "#7b8b93", "#7697a0"] }] }} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }} />
    </div>
  );
}
