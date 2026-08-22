"use client";

import SignupForm from "@/components/SignupForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { HEADING } from "./styles";

// The mailing-list signup, lifted out of the hero into a reusable modal so the
// "Stay Updated" button (hero) and the speakers page can share one flow. Radix
// handles focus-trap, Escape, scroll-lock, and the backdrop; the navy panel look
// lives in the shared DialogContent/DialogOverlay.
export default function UpdatesModal({ onClose }: { onClose: () => void }) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-w-[540px] flex-col items-center gap-5 px-9 py-8">
        <div className="text-center">
          <DialogTitle
            className={`${HEADING} text-[clamp(22px,3vw,28px)] text-cream`}
          >
            Join the List
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-[15px] text-cream/80">
            Get notified about ticket sales, updates, volunteer opportunities,
            future events, and more
          </DialogDescription>
        </div>
        <SignupForm />
      </DialogContent>
    </Dialog>
  );
}
