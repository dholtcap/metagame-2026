import SiteFooter from "@/components/site/SiteFooter";
import SiteNav from "@/components/site/SiteNav";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream font-[family-name:var(--font-inter)] leading-[1.55] text-ink">
      <SiteNav />
      <main className="flex-1 overflow-x-clip">{children}</main>
      <SiteFooter />
    </div>
  );
}
