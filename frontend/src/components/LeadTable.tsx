interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  assignedTo: string;
}

interface LeadTableProps {
  leads: Lead[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<string, string> = {
  New: "bg-sky-100 text-sky-700",
  Contacted: "bg-amber-100 text-amber-700",
  Qualified: "bg-emerald-100 text-emerald-700",
  Converted: "bg-emerald-200 text-emerald-800",
  Lost: "bg-rose-100 text-rose-700",
  default: "bg-slate-100 text-slate-700",
};

function LeadTable({ leads, onView, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left dark:divide-slate-700">
        <thead className="sticky top-0 bg-slate-50 shadow-sm dark:bg-slate-900">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">Email</th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">Phone</th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">Source</th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">Assigned To</th>
            <th className="px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-950">
          {leads.map((lead) => (
            <tr key={lead._id} className="group transition hover:bg-slate-50 dark:hover:bg-slate-900">
              <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{lead.name}</td>
              <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.email}</td>
              <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.phone}</td>
              <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.source}</td>
              <td className="px-4 py-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[lead.status] ?? statusColors.default}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-slate-600">{lead.assignedTo}</td>
              <td className="px-4 py-4 text-sm text-slate-600">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onView(lead._id)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(lead._id)}
                    className="rounded-full bg-sky-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-sky-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="rounded-full bg-rose-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
