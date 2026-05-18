import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import Navbar from "../components/Navbar.tsx";
import api from "../api/axios.ts";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  assignedTo: string;
  createdAt?: string;
}

function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [summary, setSummary] = useState<{ total: number; newToday: number; statusCounts: Record<string, number> } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryResponse, leadsResponse] = await Promise.all([
          api.get("/leads/summary"),
          api.get("/leads", { params: { limit: 100 } })
        ]);

        if (summaryResponse.data?.data) {
          setSummary(summaryResponse.data.data);
        }

        const data = Array.isArray(leadsResponse.data) ? leadsResponse.data : leadsResponse.data?.data || [];
        setLeads(data.slice(0, 100));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const total = summary?.total ?? leads.length;
  const converted = summary?.statusCounts?.Converted ?? leads.filter((lead) => lead.status?.toLowerCase() === "converted").length;
  const lost = summary?.statusCounts?.Lost ?? leads.filter((lead) => lead.status?.toLowerCase() === "lost").length;
  const today = summary?.newToday ?? leads.filter((lead) => {
    if (!lead.createdAt) return false;
    const createdDate = new Date(lead.createdAt);
    const now = new Date();
    return (
      createdDate.getFullYear() === now.getFullYear() &&
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getDate() === now.getDate()
    );
  }).length;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <Navbar title="Dashboard" />

          <div className="grid gap-6 md:grid-cols-4">
            <StatCard title="Total leads" value={loading ? "…" : total} />
            <StatCard title="Converted" value={loading ? "…" : converted} />
            <StatCard title="Lost" value={loading ? "…" : lost} />
            <StatCard title="New today" value={loading ? "…" : today} />
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent leads</h3>
                <p className="text-sm text-slate-500">Quick view of the latest lead activity.</p>
              </div>
              <Link
                to="/leads"
                className="inline-flex items-center justify-center rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 hover:text-sky-900"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : leads.length === 0 ? (
              <p className="text-sm text-slate-500">No leads available yet.</p>
            ) : (
              <ul className="space-y-3">
                {leads.slice(0, 6).map((lead) => (
                  <li
                    key={lead._id}
                    className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-base font-semibold text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.email} • {lead.phone}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {lead.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

