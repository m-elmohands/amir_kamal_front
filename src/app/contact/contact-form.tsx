"use client";
import { useState } from "react";
import { sendInquiry } from "@/services/api";
import type { Messages } from "@/i18n/messages";
export function ContactForm({
  productId,
  initialSubject,
  messages: t,
}: {
  productId?: number;
  initialSubject?: string;
  messages: Messages["contact"];
}) {
  const [status, setStatus] = useState<{
    kind: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ kind: "idle" });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "loading" });
    const form = new FormData(event.currentTarget);
    try {
      const message = await sendInquiry({
        product_id: productId,
        name: String(form.get("name")),
        company: String(form.get("company")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        subject: String(form.get("subject")),
        message: String(form.get("message")),
      });
      setStatus({ kind: "success", message });
      event.currentTarget.reset();
    } catch {
      setStatus({ kind: "error", message: t.failure });
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      {status.kind === "success" && (
        <div className="notice" role="status">
          {status.message}
        </div>
      )}
      {status.kind === "error" && (
        <div className="notice error-notice" role="alert">
          {status.message}
        </div>
      )}
      <div className="two">
        <label>
          {t.name}
          <input required name="name" autoComplete="name" />
        </label>
        <label>
          {t.company}
          <input name="company" autoComplete="organization" />
        </label>
      </div>
      <div className="two">
        <label>
          {t.emailAddress}
          <input required type="email" name="email" autoComplete="email" />
        </label>
        <label>
          {t.phoneNumber}
          <input name="phone" autoComplete="tel" />
        </label>
      </div>
      <label>
        {t.subject}
        <input required name="subject" defaultValue={initialSubject} />
      </label>
      <label>
        {t.help}
        <textarea
          required
          minLength={10}
          rows={7}
          name="message"
          placeholder={t.messagePlaceholder}
        />
      </label>
      <button className="button" disabled={status.kind === "loading"}>
        {status.kind === "loading" ? t.sending : t.send}
      </button>
    </form>
  );
}
