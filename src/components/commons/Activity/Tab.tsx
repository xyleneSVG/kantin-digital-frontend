"use client";

interface Props {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export function TabComponent({ activeTab, onChangeTab }: Props) {
  return (
    <div className="mx-4 flex justify-center">
      <div className="flex w-full max-w-87.5 justify-around rounded-lg text-center text-[14px] font-semibold">
        <button
          onClick={() => onChangeTab("Antrean")}
          className={`w-25 border-b p-1 ${
            activeTab === "Antrean"
              ? "border-primary text-primary"
              : "border-transparent"
          }`}
        >
          Antrean
        </button>

        <button
          onClick={() => onChangeTab("Riwayat")}
          className={`w-25 border-b p-1 ${
            activeTab === "Riwayat"
              ? "border-primary text-primary"
              : "border-transparent"
          }`}
        >
          Riwayat
        </button>
      </div>
    </div>
  );
}
