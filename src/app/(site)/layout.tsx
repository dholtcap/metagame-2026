import SiteFooter from "@/components/site/SiteFooter";
import SideRail from "@/components/site/SideRail";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-background font-[family-name:var(--font-inter)] leading-[1.55] text-ink">
      {/* Fixed vertical icon rail — persists over the whole one-pager. */}
      <SideRail />
      {/* Reserve a left gutter (only where the rail shows, md+) so the content
          corridor clears the rail's lane instead of sliding under it. Pairs with
          RAIL_SIDE in SideRail — flip to pr-* if the rail moves to the right. */}
      <main className="flex-1 overflow-x-clip md:pl-20 lg:pl-24">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
