import Link from "next/link";

export default function LanguageLandingPage() {
  return (
    <main className="maintenance-page">
      <div>
        <span className="eyebrow">Axis Industrial</span>
        <h1>Select language</h1>
        <div className="hero-actions language-landing-actions">
          <Link className="button" href="/en/">
            English
          </Link>
          <Link className="button dark" href="/ar/">
            العربية
          </Link>
        </div>
      </div>
    </main>
  );
}
