import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Leads", path: "/leads" },
];

function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-6 py-8 lg:block dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-600">GigFlow</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Smart Leads</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sales performance and lead management.</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-200/50"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-10 w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
