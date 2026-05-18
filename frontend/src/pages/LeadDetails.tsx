import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import Navbar from "../components/Navbar.tsx";
import api from "../api/axios.ts";

interface StatusHistoryEntry {
  status: string;
  date: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  assignedTo: string;
  createdAt?: string;
  updatedAt?: string;
  statusHistory?: StatusHistoryEntry[];
}

function LeadDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLead = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<{ data: Lead }>(`/leads/${id}`);
        setLead(response.data.data);
      } catch (err) {
        setError("Could not load lead details.");
      } finally {
        setLoading(false);
      }
    };

    loadLead();
  }, [id]);

  const timeline = lead?.statusHistory?.length
    ? lead.statusHistory
    : lead
    ? [
        {
          status: lead.status,
          date: lead.updatedAt || lead.createdAt || new Date().toISOString(),
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <Navbar title="Lead details" />

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Lead overview</h2>
                  <p className="mt-2 text-sm text-slate-500">Review the lead&apos;s current profile and actions.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/leads/${id}/edit`)}
                    className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Edit lead
                  </button>
                  <button
                    onClick={() => navigate("/leads")}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back to leads
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500">Loading lead details…</p>
              ) : error ? (
                <p className="text-sm text-rose-600">{error}</p>
              ) : lead ? (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Name</p>
                      <p className="mt-3 text-xl font-semibold text-slate-900">{lead.name}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Status</p>
                      <p className="mt-3 text-xl font-semibold text-slate-900">{lead.status}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Email</p>
                      <p className="mt-3 text-slate-900">{lead.email}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Phone</p>
                      <p className="mt-3 text-slate-900">{lead.phone}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Source</p>
                      <p className="mt-3 text-slate-900">{lead.source}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Assigned to</p>
                      <p className="mt-3 text-slate-900">{lead.assignedTo}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Created</p>
                    <p className="mt-3 text-slate-900">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "Unknown"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Lead not found.</p>
              )}
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Status history</h3>
              <div className="mt-6 space-y-4">
                {timeline.length === 0 ? (
                  <p className="text-sm text-slate-500">No status history available.</p>
                ) : (
                  timeline.map((entry) => (
                    <div key={`${entry.status}-${entry.date}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-700">{entry.status}</p>
                      <p className="mt-2 text-sm text-slate-500">{new Date(entry.date).toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LeadDetails;
