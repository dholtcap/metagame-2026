import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { EYEBROW, HEADING } from "@/components/site/styles";

export const metadata: Metadata = {
  title: "Credits — Metagame 2026",
  description:
    "Attributions for the icons and artwork used on the Metagame 2026 site.",
};

// Noun Project icons (CC BY 3.0). The section dividers use these; the baked-in
// attribution was stripped from the art and the required credit lives here.
const NOUN_PROJECT: { name: string; author: string; href: string }[] = [
  {
    name: "Monopoly Iron",
    author: "Anna Lupean",
    href: "https://thenounproject.com/browse/icons/term/monopoly-iron/",
  },
  {
    name: "Monopoly Hat",
    author: "Anna Lupean",
    href: "https://thenounproject.com/browse/icons/term/monopoly-hat/",
  },
  {
    name: "Monopoly Shoe",
    author: "Anna Lupean",
    href: "https://thenounproject.com/browse/icons/term/monopoly-shoe/",
  },
  {
    name: "Pac Man",
    author: "emkamal kamaluddin",
    href: "https://thenounproject.com/browse/icons/term/pac-man/",
  },
  {
    name: "Cherry",
    author: "Daniel Falk",
    href: "https://thenounproject.com/browse/icons/term/cherry/",
  },
  {
    name: "Wheat",
    author: "Callum Taylor",
    href: "https://thenounproject.com/browse/icons/term/wheat/",
  },
  {
    name: "Wood",
    author: "Callum Taylor",
    href: "https://thenounproject.com/browse/icons/term/wood/",
  },
  {
    name: "Brick",
    author: "Callum Taylor",
    href: "https://thenounproject.com/browse/icons/term/brick/",
  },
  {
    name: "Wool",
    author: "Callum Taylor",
    href: "https://thenounproject.com/browse/icons/term/wool/",
  },
];

// game-icons.net icons (CC BY 3.0), used across the other dividers.
const GAME_ICONS: { name: string; author: string; href: string }[] = [
  {
    name: "Crossbow",
    author: "carl-olsen",
    href: "https://game-icons.net/1x1/carl-olsen/crossbow.html",
  },
  {
    name: "Trident",
    author: "lorc",
    href: "https://game-icons.net/1x1/lorc/trident.html",
  },
  {
    name: "Clock Tower",
    author: "caro-asercion",
    href: "https://game-icons.net/1x1/caro-asercion/clock-tower.html",
  },
  {
    name: "Sword Wound",
    author: "lorc",
    href: "https://game-icons.net/1x1/lorc/sword-wound.html",
  },
  {
    name: "Chest",
    author: "delapouite",
    href: "https://game-icons.net/1x1/delapouite/chest.html",
  },
  {
    name: "Spiked Dragon Head",
    author: "delapouite",
    href: "https://game-icons.net/1x1/delapouite/spiked-dragon-head.html",
  },
  {
    name: "Stone Wall",
    author: "delapouite",
    href: "https://game-icons.net/1x1/delapouite/stone-wall.html",
  },
  {
    name: "Card 2 Spades",
    author: "aussiesim",
    href: "https://game-icons.net/1x1/aussiesim/card-2-spades.html",
  },
  {
    name: "Card 2 Hearts",
    author: "aussiesim",
    href: "https://game-icons.net/1x1/aussiesim/card-2-hearts.html",
  },
  {
    name: "Card 2 Clubs",
    author: "aussiesim",
    href: "https://game-icons.net/1x1/aussiesim/card-2-clubs.html",
  },
  {
    name: "Card 2 Diamonds",
    author: "aussiesim",
    href: "https://game-icons.net/1x1/aussiesim/card-2-diamonds.html",
  },
];

const LINK = "font-semibold text-navy underline underline-offset-2";

export default function CreditsPage() {
  return (
    <main className="min-h-dvh bg-background px-[clamp(20px,5vw,56px)] py-[clamp(32px,6vh,72px)] font-[family-name:var(--font-inter)] leading-[1.55] text-ink">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 text-[13px] tracking-[0.16em] text-ink/60 uppercase transition hover:text-ink"
        >
          <FaArrowLeft size={12} aria-hidden /> Back
        </Link>

        <h1 className={`${HEADING} mt-6 text-[clamp(32px,5vw,52px)] text-navy`}>
          Credits
        </h1>
        <p className="mt-3 max-w-[560px] text-base text-ink/70">
          The section dividers are built from third-party icons. Our thanks to
          their creators — attributions below.
        </p>

        <section className="mt-12">
          <p className={`${EYEBROW} mb-4 text-meeple`}>
            Icons &middot; Noun Project (CC BY 3.0)
          </p>
          <ul className="flex flex-col gap-2.5">
            {NOUN_PROJECT.map(({ name, author, href }) => (
              <li key={name} className="text-[15px] text-ink/80">
                <span className="font-semibold text-ink">{name}</span> by{" "}
                {author} from{" "}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  Noun Project
                </a>{" "}
                (CC BY 3.0)
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <p className={`${EYEBROW} mb-4 text-meeple`}>
            Icons &middot; game-icons.net (CC BY 3.0)
          </p>
          <ul className="flex flex-col gap-2.5">
            {GAME_ICONS.map(({ name, author, href }) => (
              <li key={name} className="text-[15px] text-ink/80">
                <span className="font-semibold text-ink">{name}</span> by{" "}
                {author} from{" "}
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={LINK}
                >
                  game-icons.net
                </a>{" "}
                (CC BY 3.0)
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[15px] text-ink/80">
            The blood drop,{" "}
            <a
              href="https://www.svgrepo.com/svg/65401/big-blood-drop"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
            >
              Big Blood Drop
            </a>
            , is from SVG Repo.
          </p>
        </section>
      </div>
    </main>
  );
}
