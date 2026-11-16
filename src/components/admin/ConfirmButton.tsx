"use client";

/** Submit button that asks for confirmation before submitting its form. */
export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="btn border border-red-200 bg-surface text-red-600 hover:bg-red-50"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
