// Layout shell every section divider shares: two hairlines flanking the icons.
// `data-section-divider` is functional — useSectionSpy's goTo() looks for it on
// the element right before a section to scroll there instead, and scroll-mt is
// the offset that clears the mobile corner nav.
export default function DividerRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-section-divider
      className="flex scroll-mt-16 items-center justify-center gap-[22px] py-6 md:scroll-mt-24 md:py-10"
    >
      <span className="h-px max-w-40 flex-1 bg-line" />
      {children}
      <span className="h-px max-w-40 flex-1 bg-line" />
    </div>
  );
}
