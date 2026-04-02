export const loginUser = async (identifier: string, password: string) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nis: identifier,
        password: password,
      }),
    });

    const json = await res.json();

    if (!res.ok || json.meta.code !== 1000) {
      const apiCode = json.meta?.code;
      console.log(apiCode)

      let errorDetail = {
        type: "error",
        title: "Login Gagal",
        message: "Terjadi kesalahan saat mencoba masuk ke akun Anda.",
        highlight: json.meta?.message || "Kesalahan sistem tidak diketahui.",
      };

      switch (apiCode) {
        case 1001:
          errorDetail.message = "Akun tidak ditemukan.";
          errorDetail.highlight =
            "NIS yang Anda masukkan belum terdaftar di sistem.";
          break;
        case 1002:
          errorDetail.message = "Format Input Salah.";
          errorDetail.highlight =
            "Pastikan format NIS dan Password sudah sesuai standar.";
          break;
        case 1003:
          errorDetail.message = "Kredensial Salah.";
          errorDetail.highlight =
            "Password yang Anda masukkan tidak cocok. Silakan coba lagi.";
          break;
        case 1008:
          errorDetail.message = "Sesi Berakhir.";
          errorDetail.highlight =
            "Token sesi Anda sudah kadaluarsa, silakan refresh halaman.";
          break;
        default:
          errorDetail.message = "Gagal Mengakses Akun.";
          errorDetail.highlight =
            json.meta?.message ||
            "Terjadi kendala pada server (Internal Error).";
          break;
      }
      throw errorDetail;
    }

    localStorage.setItem("api_key", json.data.api_key);
    localStorage.setItem("api_secret", json.data.api_secret);

    return json.data;
  } catch (err) {
    throw err;
  }
};
