import { useEffect, useState } from "react";

interface FiltersProps {
  search: string;
  status: string;
  source: string;
  sort: string;
  onFilterChange: (filters: { search: string; status: string; source: string; sort: string }) => void;
  onReset: () => void;
}

const statuses = ["All", "New", "Contacted", "Qualified", "Converted", "Lost"];
const sources = ["All", "Website", "Email", "Referral", "Social", "Other"];

function Filters({ search, status, source, sort, onFilterChange, onReset }: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      onFilterChange({ search: searchTerm, status, source, sort });
    }, 300);

    return () => window.clearTimeout(handle);
  }, [searchTerm, status, source, sort, onFilterChange]);

  const activeFilters = [
    status !== "All" ? `Status: ${status}` : null,
    source !== "All" ? `Source: ${source}` : null,
    sort !== "new" ? `Sort: ${sort === "old" ? "Oldest" : "Newest"}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="col-span-1 min-w-0">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Search</label>
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="mt-2 w-full min-w-0 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
            placeholder="Search by name, email, or phone"
          />
        </div>

        <label className="space-y-2 text-sm font-medium text-slate-700 min-w-0">
          Status
          <select
            value={status}
            onChange={(event) => onFilterChange({ search: searchTerm, status: event.target.value, source, sort })}
            className="mt-2 w-full min-w-0 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
          >
            {statuses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 min-w-0">
          Source
          <select
            value={source}
            onChange={(event) => onFilterChange({ search: searchTerm, status, source: event.target.value, sort })}
            className="mt-2 w-full min-w-0 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-slate-700"
          >
            {sources.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 min-w-0">
          Sort
          <select
            value={sort}
            onChange={(event) => onFilterChange({ search: searchTerm, status, source, sort: event.target.value })}
            className="mt-2 w-full min-w-0 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          >
            <option value="new">Newest</option>
            <option value="old">Oldest</option>
          </select>
        </label>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span key={filter} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              {filter}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Filters are applied instantly to the lead list.</p>
        <button
          onClick={() => {
            setSearchTerm("");
            onFilterChange({ search: "", status: "All", source: "All", sort: "new" });
            onReset();
          }}
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}

export default Filters;
