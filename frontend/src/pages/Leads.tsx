import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import Navbar from "../components/Navbar.tsx";
import Filters from "../components/Filters.tsx";
import LeadTable from "../components/LeadTable.tsx";
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

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [source, setSource] = useState("All");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const navigate = useNavigate();

  const [exporting, setExporting] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: status !== "All" ? status : undefined,
        source: source !== "All" ? source : undefined,
        sort,
      };

      const response = await api.get("/leads", { params });
      if (Array.isArray(response.data)) {
        setLeads(response.data);
        setTotalPages(1);
      } else {
        setLeads(Array.isArray(response.data.data) ? response.data.data : []);
        setTotalPages(response.data.totalPages || response.data.pages || 1);
      }
    } catch (error) {
      console.error(error);
      setLeads([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [page, search, status, source, sort]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      loadLeads();
    } catch (error) {
      console.error(error);
      alert("Failed to delete lead.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <Navbar title="Leads" />

          <div className="grid gap-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Filter leads</h3>
                <p className="text-sm text-slate-500">Use the quick panel to narrow your search.</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersVisible((prev) => !prev)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {filtersVisible ? "Hide filters" : "Show filters"}
                </button>
                <button
                  type="button"
                  onClick={loadLeads}
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setExporting(true);
                    try {
                      const params: Record<string, string | number | undefined> = {
                        page,
                        limit: 10,
                        search: search.trim() || undefined,
                        status: status !== "All" ? status : undefined,
                        source: source !== "All" ? source : undefined,
                        sort,
                      };
                      const response = await api.get("/leads/export", {
                        params,
                        responseType: "blob",
                      });
                      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "leads.csv";
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      window.URL.revokeObjectURL(url);
                    } catch (exportError) {
                      console.error(exportError);
                      alert("Unable to export leads. Please try again.");
                    } finally {
                      setExporting(false);
                    }
                  }}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {exporting ? "Exporting…" : "Export CSV"}
                </button>
              </div>
            </div>

            {filtersVisible && (
              <Filters
                search={search}
                status={status}
                source={source}
                sort={sort}
                onFilterChange={({ search: newSearch, status: newStatus, source: newSource, sort: newSort }) => {
                  setSearch(newSearch);
                  setStatus(newStatus);
                  setSource(newSource);
                  setSort(newSort);
                  setPage(1);
                }}
                onReset={() => {
                  setSearch("");
                  setStatus("All");
                  setSource("All");
                  setSort("new");
                  setPage(1);
                }}
              />
            )}
          </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Leads</h3>
                  <p className="text-sm text-slate-500">Browse and manage every lead in your pipeline.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate("/create-lead")}
                    className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Create lead
                  </button>
                  <button
                    type="button"
                    onClick={loadLeads}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    Refresh list
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-sm text-slate-500">Loading leads…</p>
              ) : leads.length === 0 ? (
                <div className="space-y-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-900">No leads match your filters yet.</p>
                  <p className="text-sm text-slate-500">Try resetting filters or add a new lead to populate your pipeline.</p>
                  <button
                    type="button"
                    onClick={() => navigate("/create-lead")}
                    className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Create lead
                  </button>
                </div>
              ) : (
                <LeadTable
                  leads={leads}
                  onView={(id) => navigate(`/leads/${id}`)}
                  onEdit={(id) => navigate(`/leads/${id}/edit`)}
                  onDelete={handleDelete}
                />
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

