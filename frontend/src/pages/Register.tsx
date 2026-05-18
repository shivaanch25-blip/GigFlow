import type { FormEvent } from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.ts";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (response.data.success === false) {
        setError(response.data.message || "Registration failed. Please try again.");
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || (err.response?.status === 409 ? "Email already registered." : "Registration failed. Please try again.");
        setError(errorMessage);
      } else {
        setError(
          err instanceof Error
            ? err.message || "Registration failed. Please try again."
            : "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-600">GigFlow</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Create Account</h1>
          <p className="mt-3 text-sm text-slate-500">Join our platform to start managing leads.</p>
        </div>

        <form className="space-y-5 mx-auto max-w-[440px]" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Full Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              required
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Your full name"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="you@example.com"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Enter your password"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Confirm Password
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              required
              className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Confirm your password"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {error && <p className="text-sm text-rose-600 text-center">{error}</p>}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-3">Already have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-3xl border border-sky-600 bg-sky-50 px-4 py-3 text-base font-semibold text-sky-600 transition hover:bg-sky-100"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
