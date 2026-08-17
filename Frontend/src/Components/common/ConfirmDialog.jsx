import React, { useEffect, useRef } from "react";

/**
 * Accessible confirmation dialog for destructive actions.
 * Replaces the bare window.confirm / instant-delete patterns.
 *
 * Renders nothing unless `open` is true.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}) {
  const confirmRef = useRef(null);

  // Close on Escape, and lock background scrolling while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape" && !busy) onCancel?.();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog so keyboard users land in the right place.
    confirmRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="chin-dialog-backdrop"
      onClick={() => !busy && onCancel?.()}
      role="presentation"
    >
      <div
        className="chin-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="chin-dialog-title"
        aria-describedby={message ? "chin-dialog-message" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <h5 id="chin-dialog-title" className="chin-dialog-title">
          {title}
        </h5>

        {message && (
          <p id="chin-dialog-message" className="chin-dialog-message">
            {message}
          </p>
        )}

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmRef}
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                />
                Working…
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
