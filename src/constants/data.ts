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
  },
  home: {
    headerImage: ASSETS.HOME.HEADER,
    canteenRecommendation: [
      {
        id: "/kantin/12345",
        image: ASSETS.HOME.KANTIN.A,
        name: "Kantin Jono",
        rating: 4.9,
      },
      {
        id: "/kantin/321",
        image: ASSETS.HOME.KANTIN.B,
        name: "Kantin Borak",
        rating: 4.9,
      },
      {
        id: "/kantin/555",
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
        id: "123", // Harus sama dengan id menu di detail kantin
        kantinId: "12345", // Menuju Kantin Jono
        image: ASSETS.HOME.MENU.A,
        name: "Paket A",
        rating: 4.9,
      },
      {
        id: "321", // Harus sama dengan id menu di detail kantin
        kantinId: "321", // Menuju Kantin Borak
        image: ASSETS.HOME.MENU.B,
        name: "Paket B",
        rating: 4.9,
      },
      {
        id: "m1", // Harus sama dengan id menu di detail kantin
        kantinId: "555", // Menuju Kantin Cocop
        image: ASSETS.HOME.MENU.C,
        name: "Menu A",
        rating: 4.9,
      },
      {
        id: "d1", // Harus sama dengan id menu di detail kantin
        kantinId: "12345", // Menuju Kantin Jono
        image: ASSETS.HOME.MENU.C,
        name: "Minuman A",
        rating: 4.9,
      },
    ],
  },
};