import { useEffect } from "react";

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
}

export function Toast({ message, actionLabel, onAction, onDismiss }: ToastProps) {
  useEffect(() => {
    const id = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(id);
  }, [message, onDismiss]);

  return (
    <div className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      <div role="status" className="toast-in flex items-center gap-4 rounded-full bg-ink py-2 pr-2 pl-5 text-sm text-paper shadow-xl shadow-black/20">
        <span>{message}</span>
        {actionLabel && onAction && (
          <button type="button" onClick={onAction} className="rounded-full px-3 py-1.5 font-semibold hover:bg-white/15">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
