"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError, sendInquiry } from "@/services/api";
import type { Messages } from "@/i18n/messages";
export function ContactForm({ messages: t }: { messages: Messages["contact"] }) {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");
  const parsedProductId = productParam ? Number(productParam) : undefined;
  const productId = Number.isInteger(parsedProductId) ? parsedProductId : undefined;
  const initialSubject = searchParams.get("subject") ?? undefined;
  const [status, setStatus] = useState<{
    kind: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ kind: "idle" });
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "loading" });
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      const message = await sendInquiry({
        product_id: productId,
        name: String(form.get("name")),
        company: String(form.get("company")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        requested_quantity: form.get("requested_quantity")
          ? Number(form.get("requested_quantity"))
          : undefined,
        machine_model: String(form.get("machine_model")),
        material: String(form.get("material")),
        subject: String(form.get("subject")),
        message: String(form.get("message")),
      });

      formElement.reset();
      setStatus({ kind: "success", message });
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 422
          ? t.validationFailure
          : error instanceof ApiError && error.status === 429
            ? t.rateLimitFailure
            : t.failure;
      setStatus({ kind: "error", message });
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
      <fieldset className="application-fields">
        <legend>{t.applicationDetails}</legend>
        <p>{t.applicationHint}</p>
        <div className="two">
          <label>
            {t.quantity}
            <input type="number" min="1" name="requested_quantity" inputMode="numeric" />
          </label>
          <label>
            {t.machine}
            <input name="machine_model" />
          </label>
        </div>
        <label>
          {t.material}
          <input name="material" />
        </label>
      </fieldset>
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
