import React from "react";

interface Props {
  type: "error" | "order";
  isOpen: boolean;
  title: string;
  message: string;
  highlight: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export const ModalComponent: React.FC<Props> = ({
  type,
  isOpen,
  title,
  message,
  highlight,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isOrder = type === "order";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-xl text-center flex flex-col items-center animate-in fade-in zoom-in duration-200">

        <div className="mb-4 text-3xl">
          {isOrder ? "⚠️" : "❌"}
        </div>

        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {title}
        </h2>

        <p className="mb-4 text-sm text-gray-500">
          {message}
        </p>

        <div className={`mb-6 w-full rounded-lg py-3 px-4 text-sm font-medium ${isOrder ? "bg-red-50 text-red-600" : "bg-red-100 text-red-700"
          }`}>
          {highlight}
        </div>

        <div className="w-full flex flex-col gap-2">
          {isOrder ? (
            <>
              <button
                onClick={onClose}
                className="w-full py-3 text-base font-semibold text-gray-600 transition-colors hover:text-gray-800"
              >
                Cek Lagi
              </button>
              <button
                onClick={onConfirm}
                className="w-full rounded-xl bg-[#68a68b] py-3 text-base font-semibold text-white transition-colors hover:bg-[#578d75] active:scale-[0.98]"
              >
                Ya, Pesan Sekarang
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#68a68b] py-3 text-base font-semibold text-white transition-colors hover:bg-[#578d75] active:scale-[0.98]"
            >
              Coba Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
};