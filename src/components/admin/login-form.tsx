type LoginFormProps = {
  error?: string;
};

export function LoginForm({ error }: LoginFormProps) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-cyan-100">Correo</label>
          <input
            name="email"
            type="email"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
            placeholder="docente@ceba.edu.pe"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-cyan-100">Contraseña</label>
          <input
            name="password"
            type="password"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
            placeholder="Ingresa tu contraseña"
          />
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <button
          type="submit"
          className="rounded-2xl bg-cyan-300 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
        >
          Ingresar al panel docente
        </button>
      </div>
    </div>
  );
}
