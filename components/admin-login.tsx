"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const signinErrors: Record<string, string> = {
  unavailable: "This sign-in option is not connected or is temporarily unavailable. Use your administrator password.",
  invalid: "Open the control panel and start sign-in again.",
  expired: "This sign-in request expired or was already used. Please start again.",
  cancelled: "Sign-in was cancelled. You can try again or use your administrator password.",
  denied: "This account is not authorised to manage this website. Use your approved owner account.",
  limited: "Too many sign-in attempts. Please try again in 15 minutes.",
};

export function AdminLogin({ configured, providers, signin }: {
  configured: boolean;
  providers: { google: boolean; github: boolean };
  signin?: string;
}) {
  const [password, setPassword] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const router = useRouter();
  const providerError = signin && Object.hasOwn(signinErrors, signin) ? signinErrors[signin] : "";
  async function login(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try {
      const r = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const d = await r.json() as {error?:string};
      if (!r.ok) throw new Error(d.error || "Unable to sign in.");
      setPassword(""); router.replace("/admin"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to sign in."); }
    finally { setBusy(false); }
  }
  return <main className="cp-login cp">
    <div className="cp-login-brand"><img src="/jn-logo-mark.png" width={86} height={63} alt="Julkar Naeem" /><span>JULKAR NAEEM<small>WEBSITE CONTROL PANEL</small></span></div>
    <section className="cp-login-card" aria-labelledby="signin-heading">
      <ShieldCheck size={28} aria-hidden="true" />
      <p className="cp-eyebrow">PRIVATE WORKSPACE</p>
      <h1 id="signin-heading">Your website.<br /><em>Under control.</em></h1>
      <p>Manage project stories, approved model views and the information your clients see.</p>
      {configured ? <>
        {providerError && <p className="cp-error" role="alert">{providerError}</p>}
        <div className="cp-social-login" role="group" aria-label="Owner account sign-in">
          {(["google", "github"] as const).map(provider => {
            const enabled = providers[provider];
            return <form key={provider} action={`/api/admin/oauth/${provider}`} method="post">
              <button className="cp-provider-button" type="submit" disabled={!enabled} aria-describedby={!enabled ? "provider-setup-note" : "owner-signin-note"}>
                {provider === "google" ? <FcGoogle size={21} aria-hidden="true" /> : <FaGithub size={21} aria-hidden="true" />}
                <span>Continue with {provider === "google" ? "Google" : "GitHub"}</span>
                {!enabled && <small>Not connected</small>}
              </button>
            </form>;
          })}
        </div>
        {(!providers.google || !providers.github) && <p id="provider-setup-note" className="cp-signin-note">Provider setup is pending. Use your administrator password below.</p>}
        <p id="owner-signin-note" className="cp-signin-note">Access is limited to the approved website owner.</p>
        <div className="cp-login-divider"><span>or use your password</span></div>
        <form onSubmit={login} className="cp-password-login">
          <label className="cp-field"><span>Administrator password</span><input type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={e => setPassword(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? "signin-error" : undefined} /></label>
          {error && <p id="signin-error" className="cp-error" role="alert">{error}</p>}
          <button className="cp-button" disabled={busy}>{busy ? "Signing in…" : "Sign in to control panel"}<ArrowUpRight size={18} aria-hidden="true" /></button>
        </form>
      </> : <div className="cp-notice"><strong>Administrator setup required</strong><p>The panel is locked until secure credentials and the website database are configured. Contact the website administrator to complete setup.</p></div>}
      <a className="cp-subtle-link" href="https://julkarnaeem.com/">Visit public website <ArrowUpRight size={15} aria-hidden="true" /></a>
    </section>
    <p className="cp-login-foot">Portfolio approval stays in your hands.</p>
  </main>;
}
