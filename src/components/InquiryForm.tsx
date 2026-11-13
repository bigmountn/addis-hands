"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export type InquiryRole = "buyer" | "seller";

type Props = {
  defaultRole?: InquiryRole;
  defaultCompany?: string;
  defaultProduct?: string;
};

export function InquiryForm({
  defaultRole = "buyer",
  defaultCompany = "",
  defaultProduct = "",
}: Props) {
  const t = useTranslations("Inquire");
  const [role, setRole] = useState<InquiryRole>(defaultRole);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const isSeller = role === "seller";
  const hasContext = Boolean(defaultCompany || defaultProduct);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      formElement.reset();
      setRole(defaultRole);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="ah-section-title text-4xl md:text-5xl">
          {isSeller ? t("titleSeller") : t("titleBuyer")}
        </h1>
        <p className="text-[var(--muted)]">
          {isSeller ? t("subtitleSeller") : t("subtitleBuyer")}
        </p>
        {isSeller ? (
          <div className="border border-[var(--line)] bg-[var(--soft)] px-4 py-4 text-sm leading-relaxed text-[var(--ink-soft)]">
            <p>{t("listingKitLead")}</p>
            <a
              href="/downloads/Addis-Hands-Listing-Information-Kit.docx"
              download
              className="mt-3 inline-flex ah-btn ah-btn-secondary"
            >
              {t("listingKitDownload")}
            </a>
          </div>
        ) : null}
      </div>

      <div className="border border-[var(--line)] bg-[var(--panel)] p-6 md:p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <input type="hidden" name="role" value={role} />

          <fieldset className="space-y-2">
            <legend className="text-sm">{t("role")}</legend>
            <div className="flex flex-wrap gap-2">
              <RoleChip
                active={role === "buyer"}
                onClick={() => setRole("buyer")}
                label={t("roleBuyer")}
              />
              <RoleChip
                active={role === "seller"}
                onClick={() => setRole("seller")}
                label={t("roleSeller")}
              />
            </div>
          </fieldset>

          {!isSeller && hasContext ? (
            <div className="space-y-2 border border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-sm">
              <p className="text-[var(--muted)]">{t("contextLabel")}</p>
              <ul className="space-y-1 text-[var(--ink)]">
                {defaultCompany ? (
                  <li>
                    <span className="text-[var(--muted)]">
                      {t("interestCompany")}:{" "}
                    </span>
                    {defaultCompany}
                  </li>
                ) : null}
                {defaultProduct ? (
                  <li>
                    <span className="text-[var(--muted)]">
                      {t("interestProduct")}:{" "}
                    </span>
                    {defaultProduct}
                  </li>
                ) : null}
              </ul>
              {defaultCompany ? (
                <input type="hidden" name="interestCompany" value={defaultCompany} />
              ) : null}
              {defaultProduct ? (
                <input type="hidden" name="interestProduct" value={defaultProduct} />
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label={`${t("name")} (${t("required")})`}
              name="name"
              required
            />
            <Field
              label={`${isSeller ? t("sellerCompany") : t("buyerCompany")} (${t("required")})`}
              name="buyerCompany"
              required
            />
            {isSeller ? (
              <input type="hidden" name="country" value="Ethiopia" />
            ) : (
              <Field
                label={`${t("country")} (${t("required")})`}
                name="country"
                required
              />
            )}
            <Field
              label={`${t("email")} (${t("required")})`}
              name="email"
              type="email"
              required
            />
            {isSeller ? (
              <Field
                label={`${t("onlinePresence")} (${t("optional")})`}
                name="onlinePresence"
                placeholder={t("onlinePresenceHint")}
              />
            ) : null}
          </div>

          {isSeller ? (
            <Field
              label={`${t("sellerFocus")} (${t("optional")})`}
              name="sellerFocus"
              placeholder={t("sellerFocusHint")}
            />
          ) : null}

          <label className="block space-y-2 text-sm">
            <span>
              {t("message")} ({t("required")})
            </span>
            <textarea
              name="message"
              required
              rows={6}
              placeholder={isSeller ? undefined : t("messageBuyerHint")}
              className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none focus:border-[var(--leather)]"
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="ah-btn ah-btn-primary disabled:opacity-60"
          >
            {status === "sending" ? t("sending") : t("submit")}
          </button>

          {status === "success" ? (
            <p className="text-sm text-[var(--olive)]">{t("success")}</p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm text-red-700">{t("error")}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

function RoleChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-2 text-sm transition ${
        active
          ? "border-[var(--leather)] bg-[var(--leather)] text-white"
          : "border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--leather)]"
      }`}
    >
      {label}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none focus:border-[var(--leather)]"
      />
    </label>
  );
}
