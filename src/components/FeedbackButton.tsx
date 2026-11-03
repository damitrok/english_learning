"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { sendFeedback } from "@/lib/account";
import { MAX_FEEDBACK_LENGTH } from "@/lib/input-guards";
import { Modal } from "@/components/Modal";

// Bottom-right round "?" button that opens the feedback form.
export function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Lessons are full-screen focus mode.
  if (pathname.startsWith("/session")) return null;

  function close() {
    setOpen(false);
  }

  function openForm() {
    setText("");
    setError(null);
    setSent(false);
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await sendFeedback(text);
      if (result.ok) setSent(true);
      else setError(result.error);
    } catch {
      setError("Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openForm}
        aria-label="Обратная связь"
        title="Обратная связь"
        className="flex size-[2.5rem] items-center justify-center rounded-full border border-border-hairline bg-graphite text-pure-white shadow-lift transition-colors hover:bg-slate"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" />
        </svg>
      </button>

      <Modal open={open} onClose={close} title="Обратная связь">
        {sent ? (
          <>
            <p className="text-body text-success-green">Спасибо! Сообщение отправлено.</p>
            <button type="button" onClick={close} className="btn-secondary mt-5 w-full">
              Закрыть
            </button>
          </>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <p className="text-body text-ash">
              Если у вас есть замечания или предложения, мы будем рады вашей обратной связи.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={MAX_FEEDBACK_LENGTH}
              rows={5}
              required
              aria-label="Ваше сообщение"
              placeholder="Ваше сообщение"
              className="w-full resize-none rounded-inputs bg-white/5 px-3 py-3 text-body text-pure-white placeholder:text-ash focus:outline-none focus:ring-1 focus:ring-coral-pulse"
            />
            {error && (
              <p role="alert" className="text-body text-coral-pulse">
                {error}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={close} disabled={pending} className="btn-secondary">
                Отмена
              </button>
              <button type="submit" disabled={pending || text.trim().length === 0} className="btn-primary">
                {pending ? "Отправляю…" : "Отправить"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
