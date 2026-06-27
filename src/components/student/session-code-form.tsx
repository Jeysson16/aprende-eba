"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SessionCodeForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/public/session/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = (await response.json()) as { valid?: boolean; message?: string };

    if (!response.ok || !data.valid) {
      setError(data.message ?? "No se encontró una sesión activa.");
      setLoading(false);
      return;
    }

    router.push(`/sesion/${code.toUpperCase()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-cyan-100">
          Código de sesión
        </label>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Ejemplo: EBA-URUBAMBA-2026"
          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
        />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-60"
      >
        {loading ? "Validando..." : "Ingresar al instrumento"}
      </button>
    </form>
  );
}
