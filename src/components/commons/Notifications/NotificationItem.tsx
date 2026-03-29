import { ICON } from "@/src/constants/assets";
import Image from "next/image";

interface Props {
  icon: "ready" | "cook";
  title: string;
  message: string;
  time: string;
}

export function NotificationItemComponent({
  icon,
  title,
  message,
  time,
}: Props) {
  const iconMap = {
    ready: ICON.NOTIFICATIONS.READY,
    cook: ICON.NOTIFICATIONS.COOK,
  };
  return (
    <div className="bg-background w-full flex flex-row items-center gap-x-4 py-3 px-4 border border-l-transparent border-r-transparent border-t-transparent border-b-[#B3B3B3]">
      <Image
        src={iconMap[icon]}
        alt={icon}
        width={1920}
        height={1920}
        className="size-9 object-cover"
      />
      <div className="flex flex-col items-start gap-y-1">
        <p className="font-medium text-[14px]">{title}</p>
        <p className="font-light text-[12px] mb-1">{message}</p>
        <p className="font-light text-[10px]">{time}</p>
      </div>
    </div>
  );
}
