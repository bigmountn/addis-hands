"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "로그인 실패");
      }
      // Full navigation so the new session cookie is always sent to middleware
      window.location.assign("/admin");
      return;
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--sand)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 border border-[var(--line)] bg-white p-8 shadow-[0_12px_40px_rgba(42,34,28,0.08)]"
      >
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--cognac)]">
            Addis Hands
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--ink)]">
            관리자 로그인
          </h1>
          <p className="text-sm text-[var(--muted)]">Admin login</p>
        </div>

        <label className="block space-y-2 text-sm">
          <span>비밀번호 (Password)</span>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-[var(--line)] px-3 py-2.5 outline-none focus:border-[var(--leather)]"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[var(--ink)] px-4 py-2.5 text-sm text-white disabled:opacity-60"
        >
          {busy ? "확인 중…" : "입장 (Enter)"}
        </button>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </form>
    </div>
  );
}
