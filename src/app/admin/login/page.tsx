"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "@/lib/actions/admin";
import { Logo } from "@/components/site/Logo";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<ActionState, FormData>(signIn, null);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <form action={action} className="card w-full max-w-sm space-y-4 p-6">
        <Logo />
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="input" autoComplete="username" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="input" autoComplete="current-password" />
        </div>
        {state && !state.ok && <p className="text-sm text-red-600" role="alert">{state.message}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
