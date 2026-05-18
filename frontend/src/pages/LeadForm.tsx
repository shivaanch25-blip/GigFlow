import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.tsx";
import Navbar from "../components/Navbar.tsx";
import api from "../api/axios.ts";

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  assignedTo: string;
}

const statusOptions = ["New", "Contacted", "Qualified", "Converted", "Lost"];
const sourceOptions = ["Website", "Email", "Referral", "Social", "Other"];

function LeadForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [form, setForm] = useState<LeadFormData>({
    name: "",
    email: "",
    phone: "",
    status: "New",
    source: "Website",
    assignedTo: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    const fetchLead = async () => {
      try {
        const response = await api.get<{ data: LeadFormData }>(`/leads/${id}`);
        setForm(response.data.data);
      } catch (err) {
        setError("Unable to load lead details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id, isEditing]);

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (isEditing && id) {
        await api.put(`/leads/${id}`, form);
      } else {
        await api.post("/leads", form);
      }
      navigate("/leads");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message || "Unable to save the lead. Please verify the fields and try again."
          : "Unable to save the lead. Please verify the fields and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <Navbar title={isEditing ? "Edit Lead" : "Create Lead"} />

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                {isEditing ? "Update lead details" : "Create a new lead"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Keep lead information up to date so your sales team can stay aligned.
              </p>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Loading lead details…</p>
            ) : (
              <form className="grid gap-6" onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Name
                    <input
                      value={form.name}
                      onChange={(event) => handleChange("name", event.target.value)}
                      required
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="Lead name"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Email
                    <input
                      value={form.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      type="email"
                      required
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="lead@example.com"
                    />
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Phone
                    <input
                      value={form.phone}
                      onChange={(event) => handleChange("phone", event.target.value)}
                      type="tel"
                      required
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="(555) 123-4567"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Assigned to
                    <input
                      value={form.assignedTo}
                      onChange={(event) => handleChange("assignedTo", event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="Sales rep"
                    />
                  </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Status
                    <select
                      value={form.status}
                      onChange={(event) => handleChange("status", event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm font-medium text-slate-700">
                    Source
                    <select
                      value={form.source}
                      onChange={(event) => handleChange("source", event.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    >
                      {sourceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-3xl bg-sky-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {saving ? "Saving lead…" : isEditing ? "Update lead" : "Create lead"}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LeadForm;
