import SiteFooter from "@/components/site/SiteFooter";
import SiteShell from "@/components/site/SiteShell";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-[family-name:var(--font-inter)] leading-[1.55] text-ink">
      {/* SiteShell owns the section nav + the gutter it needs — they vary
          together across the mobile nav variants. */}
      <SiteShell>{children}</SiteShell>
      <SiteFooter />
    </div>
  );
}
