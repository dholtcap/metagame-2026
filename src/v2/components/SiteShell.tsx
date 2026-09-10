import ExpandingNav from "./nav/ExpandingNav";

// Section nav: the corner die that unfolds into the section links.
export default function SiteShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ExpandingNav />
      {/* Symmetric gutter so the page's center doesn't shift under the corner nav. */}
      <main className="flex-1 overflow-x-clip md:px-20 lg:px-24">
        {children}
      </main>
    </>
  );
}
