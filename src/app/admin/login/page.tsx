import { BrandMark } from "@/components/BrandMark";
import { LoginForm } from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-[380px] rounded-2xl bg-white p-9 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <BrandMark className="mx-auto mb-4 h-10 w-10 rounded-xl bg-navy p-2" />
        <h1 className="font-serif text-xl font-semibold text-ink">Sign in to Harbor</h1>
        <p className="mt-1.5 mb-6 text-[13px] text-slate">Admin Console — your firm&apos;s side of the portal.</p>
        <div className="text-left">
          <LoginForm />
        </div>
        <p className="mt-6 text-[11.5px] text-slate-light">
          Demo credentials are pre-filled — every seeded team member uses the password{" "}
          <span className="font-mono">harbor-demo</span>.
        </p>
      </div>
    </div>
  );
}
