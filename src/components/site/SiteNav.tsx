"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NavLogo } from "./LogoDice";
import TicketsModal from "./TicketsModal";

const NAV_LINKS = [
  { href: "/schedule", label: "Schedule" },
  { href: "/speakers", label: "Speakers" },
  { href: "/children", label: "Children's Programming" },
  // { href: "/sponsors", label: "Sponsors" }, // no prospectus yet
  { href: "/faq", label: "FAQ" },
  { href: "/night-market", label: "The Night Market", accent: true },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ticketsOpen, setTicketsOpen] = useState(false);
  // Compact single-die logo while the hero is in view; full wordmark once
  // scrolled past it (tracked by the sentinel) or on hero-less pages.
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const sentinel = document.getElementById("hero-end-sentinel");
    if (!sentinel) return;
    const NAV_H = 73;
    const io = new IntersectionObserver(
      ([entry]) => setPastHero(entry.boundingClientRect.top <= NAV_H),
      { rootMargin: `-${NAV_H}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);
  const expanded = pathname !== "/" || pastHero;

  return (
    <header className="sticky top-0 z-50 h-[73px] min-h-[73px] border-b border-line-dark bg-navy">
      <div className="flex h-[72px] w-full items-center gap-3 px-4 sm:gap-6 sm:px-6">
        <Link
          href="/"
          aria-label="Metagame home"
          className="flex flex-none items-center"
        >
          <NavLogo
            expanded={expanded}
            className="[--nav-h:44px] sm:[--nav-h:54px]"
          />
        </Link>
        <nav
          aria-label="Main navigation"
          className={`${
            open
              ? "absolute inset-x-0 top-[72px] flex flex-col items-start gap-[18px] border-b border-line-dark bg-navy px-8 py-5"
              : "hidden"
          } whitespace-nowrap min-[1000px]:static min-[1000px]:ml-auto min-[1000px]:flex min-[1000px]:min-w-0 min-[1000px]:flex-1 min-[1000px]:flex-row min-[1000px]:items-center min-[1000px]:justify-end min-[1000px]:gap-[clamp(14px,2vw,36px)] min-[1000px]:border-0 min-[1000px]:bg-transparent min-[1000px]:p-0`}
        >
          {NAV_LINKS.map(({ href, label, accent }) => {
            const current = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                aria-current={current ? "page" : undefined}
                className={`relative py-1.5 text-[15px] font-medium after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:transition-transform after:duration-[180ms] hover:after:scale-x-100 ${
                  accent
                    ? "text-salmon after:bg-salmon"
                    : "text-cream after:bg-brand-blue"
                } ${current ? "after:scale-x-100" : "after:scale-x-0"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex flex-none items-center gap-3 min-[1000px]:ml-0 sm:gap-5">
          <Button type="button" size="sm" onClick={() => setTicketsOpen(true)}>
            Buy tickets
          </Button>
          {ticketsOpen && (
            <TicketsModal onClose={() => setTicketsOpen(false)} />
          )}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="block cursor-pointer text-[26px] text-cream min-[1000px]:hidden"
          >
            &#9776;
          </button>
        </div>
      </div>
    </header>
  );
}
