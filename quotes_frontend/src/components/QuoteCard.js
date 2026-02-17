import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * QuoteCard renders the current quote and provides actions (new quote + copy).
 * Includes improved spacing, clear button states, and an accessible "Copied!" toast.
 */

// PUBLIC_INTERFACE
export default function QuoteCard({ quote, author, onNewQuote }) {
  /** This is a public component for rendering and interacting with a quote. */
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const copiedTimerRef = useRef(null);

  const fullQuoteText = useMemo(() => {
    const q = (quote ?? "").trim();
    const a = (author ?? "").trim();
    if (!q && !a) return "";
    if (q && a) return `"${q}" — ${a}`;
    if (q) return `"${q}"`;
    return `— ${a}`;
  }, [quote, author]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    setCopyError("");
    if (!fullQuoteText) return;

    try {
      // Prefer modern clipboard API
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullQuoteText);
      } else {
        // Fallback: execCommand
        const textarea = document.createElement("textarea");
        textarea.value = fullQuoteText;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("Copy command failed");
      }

      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 1600);
    } catch (e) {
      setCopyError("Could not copy. Please try again.");
      setCopied(false);
    }
  }

  const isCopyDisabled = !fullQuoteText;

  return (
    <section className="quoteCard" aria-label="Quote card">
      <div className="quoteCard__content">
        <blockquote className="quoteCard__quote">
          <p className="quoteCard__quoteText">{quote || "—"}</p>
        </blockquote>

        <div className="quoteCard__meta" aria-label="Quote author">
          <span className="quoteCard__author">{author ? `— ${author}` : ""}</span>
        </div>
      </div>

      <div className="quoteCard__actions" role="group" aria-label="Quote actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={onNewQuote}
        >
          New quote
        </button>

        <button
          type="button"
          className="btn btn--secondary"
          onClick={handleCopy}
          disabled={isCopyDisabled}
          aria-disabled={isCopyDisabled}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Toast region */}
      <div className="quoteCard__toastRegion" aria-live="polite" aria-atomic="true">
        <div
          className={
            copied
              ? "quoteToast quoteToast--visible"
              : "quoteToast"
          }
          role="status"
        >
          Copied to clipboard
        </div>

        {copyError ? (
          <div className="quoteToast quoteToast--visible quoteToast--error" role="alert">
            {copyError}
          </div>
        ) : null}
      </div>
    </section>
  );
}
