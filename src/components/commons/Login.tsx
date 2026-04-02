"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  ButtonComponent,
  Container,
  InputComponent,
  MultilineTextComponent,
  ModalComponent
} from "@/src/components/ui";

import { DATA } from "@/src/constants/data";
import { loginUser } from "@/src/services/auth";

export default function LoginPage() {
  const data = DATA.login;
  const router = useRouter();

  const [form, setForm] = useState<Record<string, string>>({});

  const [errorState, setErrorState] = useState({
    isOpen: false,
    title: "",
    message: "",
    highlight: "",
  });

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const nis = form["identityNumber"];
      const password = form["password"] || "";

      await loginUser(nis, password);
      router.push("/");
    } catch (err: any) {
      setErrorState({
        isOpen: true,
        title: err.title,
        message: err.message,
        highlight: err.highlight
      });
    }
  };

  return (
    <>
      <Container className="mt-10 flex h-[calc(100dvh-65px)] flex-col justify-around px-2 relative">
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
                onChange={(e: any) => handleChange(name, e.target.value)}
              />
            );
          })}

          <ButtonComponent
            className="mt-1 mb-3"
            text={data.buttonText}
            onClick={handleLogin}
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

      <ModalComponent
        isOpen={errorState.isOpen}
        type={"error"}
        title={errorState.title}
        message={errorState.message}
        highlight={errorState.highlight}
        onClose={() => setErrorState({ isOpen: false, title: "", message: "", highlight: "" })} />
    </>
  );
}