"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import TicketsPanel from "./TicketsPanel";

// Modal wrapper around <TicketsPanel>: the shared Dialog supplies the navy panel,
// blurred backdrop, focus-trap, Escape and scroll-lock. The /tickets page renders
// the same panel bare inside its own box. The supporter/BTC sub-modals launched
// from within the panel are nested Radix dialogs, so Escape closes the top-most
// first and they stack above this one.
export default function TicketsModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-w-[560px] flex-col items-center gap-[22px] px-9 py-8">
        <DialogTitle className="sr-only">Tickets</DialogTitle>
        <DialogDescription className="sr-only">
          Buy a Metagame 2026 ticket in USD or Bitcoin.
        </DialogDescription>
        <TicketsPanel />
      </DialogContent>
    </Dialog>
  );
}
