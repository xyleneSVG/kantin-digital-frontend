"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, MapPin, ChevronDown, ChevronUp, Clock } from "lucide-react";

export type KantinHeaderProps = {
  kantinName: string;
  location: string;
  coverImage: string;
  operationalHours?: string;
};

export default function KantinHeader({ 
  kantinName, 
  location, 
  coverImage, 
  operationalHours = "07.30 - 17.00" 
}: KantinHeaderProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative flex flex-col items-center ${isOpen ? 'mb-24' : 'mb-16'} transition-all duration-300`}>
      <div className="relative h-48 w-full">
        <Image src={coverImage} alt="Cover Kantin" fill className="object-cover brightness-75" />
        <div className="absolute top-0 flex w-full justify-between p-4 pt-6">
          <button onClick={() => router.back()} className="flex size-8 items-center justify-center rounded-full border border-white bg-transparent text-white backdrop-blur-sm">
            <ArrowLeft size={18} />
          </button> 
        </div>
      </div>

      <div className="absolute -bottom-10 w-[90%] rounded-2xl bg-white p-4 shadow-md transition-all duration-300">
        <h1 className="text-[18px] font-bold text-gray-900">{kantinName}</h1>

        <div 
          className="mt-2 flex cursor-pointer items-center justify-between text-gray-500"
          onClick={toggleDropdown}
        >
          <div className="flex items-center gap-x-2">
            <MapPin size={16} />
            <span className="text-[13px]">{location}</span>
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-10 mt-2 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-center gap-x-2 text-gray-500">
            <Clock size={16} />
            <span className="text-[13px]">{operationalHours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}