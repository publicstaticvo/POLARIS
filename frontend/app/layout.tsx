import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POLARIS IRT Core",
  description: "Adaptive LLM evaluation platform for scientific ability scoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="site-header">
            <div className="site-brand">POLARIS IRT Core</div>
            <nav className="site-nav">
              <a href="/">Home</a>
              <a href="/leaderboard">Leaderboard</a>
              <a href="/submit">Submit</a>
              <a href="/dashboard">Dashboard</a>
              <a href="/compare">Compare</a>
              <a href="/question-hub">Question Hub</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <p>POLARIS IRT Core &copy; 2026</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
