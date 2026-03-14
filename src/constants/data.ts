import { DataType } from "../types";
import { ASSETS, ICON } from "./assets";

export const DATA: DataType = {
  onboarding: [
    {
      step: 1,
      heading: "Input Nomor Identitas",
      illustration: ASSETS.ONBOARDING[1],
      title: "Masuk ke Sistem\nPembayaran Sekolah",
      description: "Gunakan nomor identitas yang\nterdaftar di sekolah",
      buttonType: "single",
      buttonSingleText: "Selanjutnya",
      inputPlaceholder: "Nomor Identitas",
      inputType: "number",
      inputName: "identityNumber",
    },
    {
      step: 2,
      heading: "Aktivasi Akun",
      illustration: ASSETS.ONBOARDING[2],
      title: "Aktivasi Akun Diperlukan",
      description:
        "Akun ini belum aktif. Pilih metode untuk menerima password aktivasi.",
      buttonType: "double",
      buttonVariant: [
        {
          color: "#25D366",
          text: "WhatsApp",
          icon: ICON.ONBOARDING.whatsapp,
          textColor: "#FFFFFF",
          type: "whatsapp",
        },
        {
          color: "#EA4335",
          text: "Email",
          icon: ICON.ONBOARDING.email,
          textColor: "#FFFFFF",
          type: "email",
        },
      ],
    },
    {
      step: 3,
      heading: "Verifikasi Password",
      illustration: ASSETS.ONBOARDING[3],
      title: "Password Aktivasi Terkirim",
      description: "Password telah dikirim ke kontak terdaftar",
      buttonType: "single",
      buttonSingleText: "Aktifkan",
      inputPlaceholder: "Password",
      inputType: "password",
      inputName: "activationPassword",
    },
  ],
  login: {
    heading: "Login",
    illustration: ASSETS.LOGIN,
    title: "Selamat Datang",
    description: "Masukkan Nomor Identitas dan Password ",
    inputArrayText: ["Nomor Identitas", "Password"],
    inputArrayType: ["number", "password"],
		inputArrayName: ["identityNumber", "password"],
    buttonText: "Login",
    noHaveAccountRef: "/onboarding",
  },
};
