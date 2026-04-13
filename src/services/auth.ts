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

export const checkCustomerActivation = async (nis: string) => {
  try {
    const res = await fetch("/api/check-activation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nis }),
    });

    const json = await res.json();

    if (!res.ok || json.meta?.code !== 1000) {
      throw {
        type: "error",
        title: "Pengecekan Gagal",
        message: "Tidak dapat mengecek status aktivasi NIS.",
        highlight: json.meta?.message || "Terjadi kesalahan sistem.",
      };
    }
    
    return json.data; 
  } catch (err) {
    throw err;
  }
};

export const activateAccount = async (nis: string, method: string) => {
  try {
    const res = await fetch("/api/activate-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nis, activation_method: method }),
    });
    console.log(res)

    const json = await res.json();

    if (!res.ok || json.meta?.code !== 1000) {
      throw {
        type: "error",
        title: "Aktivasi Gagal",
        message: "Gagal memproses permintaan aktivasi.",
        highlight: json.meta?.message || "Silakan coba lagi beberapa saat.",
      };
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export const changePassword = async (currentPass: string, newPass: string, confirmPass: string) => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `token ${apiKey}:${apiSecret}` 
      },
      body: JSON.stringify({ 
        current_password: currentPass,
        new_password: newPass,
        confirm_password: confirmPass
      }),
    });

    const json = await res.json();

    if (!res.ok || json.meta?.code !== 1000) {
      let errorMessage = json.meta?.message || "Gagal mengubah password.";

      // 1. Tangkap error bawaan Frappe yang biasanya berbentuk HTML
      if (json._server_messages) {
        try {
          const serverMsgs = JSON.parse(json._server_messages);
          const msgObj = JSON.parse(serverMsgs[0]);
          // Bersihkan semua tag HTML menjadi spasi lalu dirapikan
          errorMessage = msgObj.message.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        } catch(e) {
          // Lanjut jika gagal parse
        }
      } 
      // 2. Tangkap error lain (seperti Pydantic)
      else if (json.error && typeof json.error === "string") {
        errorMessage = json.error.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
      }

      throw {
        type: "error",
        title: "Validation Error",
        message: errorMessage, // Ini sekarang berisi bahasa Inggris murni tanpa HTML
      };
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    // Panggil API logout untuk membersihkan session di backend
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    // Wajib: Hapus kredensial dari local storage
    localStorage.removeItem("api_key");
    localStorage.removeItem("api_secret");

    return true;
  } catch (err) {
    // Sekalipun API gagal (misal server down), kita tetap paksa hapus local storage
    // agar user tidak terjebak tidak bisa logout di aplikasi
    localStorage.removeItem("api_key");
    localStorage.removeItem("api_secret");
    throw err;
  }
};