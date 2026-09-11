import * as React from "react";

import { cn } from "@/v2/lib/utils";

// The shared dark form field (navy modals / dark sections). This is the single
// source for the field look that used to be duplicated across the modals and the
// signup form. For a cream background, override bg/border/text/placeholder/focus
// via className (e.g. the `light` signup form).
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full rounded-lg border-[1.5px] border-cream/25 bg-navy2 px-4 text-base text-cream transition-colors outline-none placeholder:text-cream/40 focus:border-tan disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
