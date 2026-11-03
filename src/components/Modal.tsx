"use client";

import { useEffect, useId, useRef } from "react";

/**
 * A dialog on the browser's own <dialog>: it traps focus, closes on Esc and sits above everything.
 * The content is mounted only while open, so forms start empty every time.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-cards border border-border-hairline bg-ink p-0 text-pure-white shadow-key backdrop:bg-black/70"
    >
      {open && (
        <div className="flex max-h-[85dvh] flex-col p-5">
          <h2 id={titleId} className="text-subheading font-medium text-pure-white">
            {title}
          </h2>
          {/* Padding with a matching negative margin keeps focus rings and button edges from being clipped by the scroller. */}
          <div className="scroll-area -mx-[0.375rem] mt-3 px-[0.375rem] pb-[0.5rem]">{children}</div>
        </div>
      )}
    </dialog>
  );
}
