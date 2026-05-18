import { useAuth } from "../context/AuthContext.tsx";
import { useTheme } from "../context/ThemeContext.tsx";

function Navbar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white px-8 py-5 shadow-sm sm:flex sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-950">
      <div className="min-w-0">
        <p className="text-sm uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{title}</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">Welcome back</h2>
      </div>
      <div className="mt-4 flex w-full min-w-0 flex-col gap-3 rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200 sm:mt-0 sm:w-full sm:flex-row sm:items-center sm:justify-between lg:w-auto">
        <span className="min-w-0 truncate">
          Signed in as <span className="font-semibold text-slate-900 dark:text-slate-100">{user?.email ?? "user@company.com"}</span>
        </span>
        <div className="flex flex-wrap items-center gap-3 justify-end">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
