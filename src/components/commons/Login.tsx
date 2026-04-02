"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ButtonComponent,
  Container,
  InputComponent,
  MultilineTextComponent,
} from "@/src/components/ui";

import { DATA } from "@/src/constants/data";
import { loginUser } from "@/src/services/auth";
import Image from "next/image";

export default function LoginPage() {
  const data = DATA.login;

  const router = useRouter();

  // ✅ state untuk semua input (dynamic)
  const [form, setForm] = useState<Record<string, string>>({});

  // ✅ handle input change (tanpa ubah UI)
  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ handle login
  const handleLogin = async () => {
    try {
      const nis = form["identityNumber"];
      const password = form["password"] || "";

      await loginUser(nis, password);

      router.push("/");
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  return (
    <Container className="mt-10 flex h-[calc(100dvh-65px)] flex-col justify-around px-2">
      <p className="mb-5 text-center font-mono text-[24px] font-bold">
        {data.heading}
      </p>

      <div>
        <Image
          src={data.illustration}
          alt={data.heading}
          width={1080}
          height={1080}
          className="mb-5 size-80"
        />

        <MultilineTextComponent
          text={data.title}
          className="mb-2 text-center font-sans text-[20px] font-semibold"
        />

        <MultilineTextComponent
          text={data.description}
          className="font-regular mb-10 text-center font-sans text-[16px]"
        />

        {data.inputArrayText.map((_, index) => {
          const name = data.inputArrayName[index] || "";

          return (
            <InputComponent
              classNameContainer="mb-4"
              key={index}
              placeholder={data.inputArrayText[index] || ""}
              inputType={data.inputArrayType[index] || ""}
              inputName={name}
              onChange={(e: any) =>
                handleChange(name, e.target.value)
              } // ✅ inject logic
            />
          );
        })}

        <ButtonComponent
          className="mt-1 mb-3"
          text={data.buttonText}
          onClick={handleLogin} // ✅ inject logic
        />

        <p className="font-sans text-[12px] font-normal text-center">
          Belum mengaktifkan akun?{" "}
          <a
            href={"/" + data.noHaveAccountRef}
            className="text-[#F31313] outline-none"
          >
            Aktifkan
          </a>
        </p>
      </div>
    </Container>
  );
}