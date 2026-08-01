"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import TicketsModal from "./TicketsModal";

// Hero call-to-action under the date: opens the buy-tickets modal (the same
// panel the /tickets section renders inline).
export default function HeroTicketsCta() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="raised"
        size="lg"
        onClick={() => setOpen(true)}
        className="h-auto px-7 py-3 text-xl"
      >
        Get Tickets
      </Button>
      {open && <TicketsModal onClose={() => setOpen(false)} />}
    </>
  );
}
