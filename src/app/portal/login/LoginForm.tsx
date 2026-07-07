"use client";

import { useActionState } from "react";
import { portalLoginAction } from "./actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(portalLoginAction, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue="priya@aurorainsure.com"
          className="w-full rounded-lg border border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-brass"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-slate">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          defaultValue="harbor-demo"
          className="w-full rounded-lg border border-border px-3 py-2.5 text-[13.5px] outline-none focus:border-brass"
        />
      </div>
      {error && <p className="text-[12.5px] font-medium text-danger">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-navy px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
