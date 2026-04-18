import { OrderTimelineProps } from "@/src/types/DetailOrder";

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.6667 3.5L5.25 9.91667L2.33333 7"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function OrderTimeline({ timeline }: OrderTimelineProps) {
  return (
    <div className="bg-secondary relative mx-4 mt-5 rounded-xl border border-gray-100 py-2 px-4 shadow-sm">
      <div className="absolute top-10 bottom-10 left-9.5 z-0 w-0.5 bg-[#6BBA9C]"></div>

      <div className="relative z-10 flex flex-col gap-y-6">
        {timeline.map((item, index) => (
          <div key={index} className="flex flex-row items-center gap-x-4">
            <div className="border-secondary flex size-9 shrink-0 items-center justify-center rounded-full border-4 bg-[#6BBA9C]">
              <CheckIcon />
            </div>
            <div className="flex flex-col gap-y-1 pt-1">
              <p className="text-[12px] font-medium text-gray-800">
                {item.title}
              </p>
              <p className="text-[10px] font-light text-gray-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
