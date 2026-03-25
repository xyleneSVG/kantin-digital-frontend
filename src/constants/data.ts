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
          icon: ICON.ONBOARDING.WHATSAPP,
          textColor: "#FFFFFF",
          type: "whatsapp",
        },
        {
          color: "#EA4335",
          text: "Email",
          icon: ICON.ONBOARDING.EMAIL,
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
  home: {
    headerImage: ASSETS.HOME.HEADER,
    canteenRecommendation: [
      {
        id: "/kantinJono12345",
        image: ASSETS.HOME.KANTIN.A,
        name: "Kantin Jono",
        rating: 4.9,
      },
      {
        id: "/kantinBorak321",
        image: ASSETS.HOME.KANTIN.B,
        name: "Kantin Borak",
        rating: 4.9,
      },
      {
        id: "/kantinCocop555",
        image: ASSETS.HOME.KANTIN.C,
        name: "Kantin Cocop",
        rating: 4.9,
      },
    ],
    category: [
      {
        id: "/kategori-ayam",
        image: ICON.HOME.KATEGORI.AYAM,
        name: "Ayam",
      },
      {
        id: "/kategori-mie",
        image: ICON.HOME.KATEGORI.MIE,
        name: "Mie",
      },
      {
        id: "/kategori-nasi",
        image: ICON.HOME.KATEGORI.NASI,
        name: "Nasi",
      },
      {
        id: "/kategori-gorengan",
        image: ICON.HOME.KATEGORI.GORENGAN,
        name: "Gorengan",
      },
      {
        id: "/kategori-eskrim",
        image: ICON.HOME.KATEGORI.ESKRIM,
        name: "Es Krim",
      },
      {
        id: "/kategori-snack",
        image: ICON.HOME.KATEGORI.SNACK,
        name: "Snack",
      },
      {
        id: "/kategori-cepat-saji",
        image: ICON.HOME.KATEGORI.CEPAT_SAJI,
        name: "Cepat Saji",
      },
      {
        id: "/kategori-kuah",
        image: ICON.HOME.KATEGORI.KUAH,
        name: "Kuah",
      },
      {
        id: "/kategori-sayur",
        image: ICON.HOME.KATEGORI.SAYUR,
        name: "Sayur",
      },
    ],
    bestChoice: [
      {
        id: "/kantin-a",
        image: ASSETS.HOME.MENU.A,
        name: "Menu A",
        rating: 4.9,
      },
      {
        id: "/kantin-b",
        image: ASSETS.HOME.MENU.B,
        name: "Menu B",
        rating: 4.9,
      },
      {
        id: "/kantin-c",
        image: ASSETS.HOME.MENU.C,
        name: "Menu C",
        rating: 4.9,
      },
      {
        id: "/kantin-d",
        image: ASSETS.HOME.MENU.C,
        name: "Menu D",
        rating: 4.9,
      },
    ]
  },
};
