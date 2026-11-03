"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteAccount } from "@/lib/account";
import { signOut } from "@/lib/auth";
import { clearPageCache } from "@/lib/page-cache";
import { Modal } from "@/components/Modal";

type Action = "signout" | "delete";

const icon = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const circle =
  "flex size-[2.5rem] shrink-0 items-center justify-center rounded-full border border-border-hairline text-pure-white shadow-lift transition-colors";

// Round profile button (bottom-right, under the feedback button): unfolds two more round buttons (sign out, delete account), each asking for confirmation.
export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<Action | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Lessons are full-screen focus mode.
  if (pathname.startsWith("/session")) return null;

  function ask(next: Action) {
    setOpen(false);
    setError(null);
    setAction(next);
  }

  function close() {
    if (!pending) setAction(null);
  }

  async function confirm() {
    if (!action) return;
    setPending(true);
    setError(null);
    // Drop the offline copies of visited pages first and regardless of whether the request
    // succeeds: the next person on this device must not be able to open them.
    await clearPageCache();
    try {
      if (action === "delete") {
        const result = await deleteAccount();
        if (!result.ok) {
          setError(result.error);
          return;
        }
      } else {
        await signOut();
      }
    } catch {
      if (action === "delete") {
        setError("Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.");
        return;
      }
    } finally {
      setPending(false);
    }
    await clearPageCache();
    setAction(null);
    router.replace("/login");
    router.refresh();
  }

  const deleting = action === "delete";

  return (
    <>
      {/* The two extra buttons unfold to the left of the profile button. */}
      <div ref={rootRef} className="flex flex-row-reverse items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Меню аккаунта"
          className={`${circle} bg-graphite hover:bg-slate`}
        >
          <svg {...icon}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
          </svg>
        </button>
        {open && (
          <>
            <button
              type="button"
              onClick={() => ask("signout")}
              aria-label="Выйти"
              title="Выйти"
              className={`${circle} bg-graphite hover:bg-slate`}
            >
              <svg {...icon}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => ask("delete")}
              aria-label="Удалить аккаунт"
              title="Удалить аккаунт"
              className={`${circle} bg-ember-hush text-coral-pulse hover:bg-ember-hush/70`}
            >
              <svg {...icon}>
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
              </svg>
            </button>
          </>
        )}
      </div>

      <Modal open={action !== null} onClose={close} title={deleting ? "Удалить аккаунт?" : "Выйти из аккаунта?"}>
        <p className="text-body text-ash">
          {deleting
            ? "Вы действительно хотите удалить свой аккаунт? Это действие необратимо: весь прогресс будет потерян."
            : "Вы действительно хотите выйти из аккаунта?"}
        </p>
        {error && (
          <p role="alert" className="mt-3 text-body text-coral-pulse">
            {error}
          </p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={close} disabled={pending} className="btn-secondary">
            Отмена
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={pending}
            className={
              deleting
                ? "btn-secondary !border-coral-pulse !text-coral-pulse disabled:opacity-60"
                : "btn-primary disabled:opacity-60"
            }
          >
            {pending ? "Подождите…" : deleting ? "Удалить" : "Выйти"}
          </button>
        </div>
      </Modal>
    </>
  );
}
