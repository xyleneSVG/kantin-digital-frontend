export const loginUser = async (identifier: string, password: string) => {
  try {
    const res = await fetch("/api/auth/login/user", {
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
      console.log(apiCode);

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
    console.log(res);

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

export const changePassword = async (
  currentPass: string,
  newPass: string,
  confirmPass: string,
) => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const apiSecret = localStorage.getItem("api_secret");

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${apiKey}:${apiSecret}`,
      },
      body: JSON.stringify({
        current_password: currentPass,
        new_password: newPass,
        confirm_password: confirmPass,
      }),
    });

    const json = await res.json();

    if (!res.ok || json.meta?.code !== 1000) {
      let errorMessage = json.meta?.message || "Gagal mengubah password.";

      if (json._server_messages) {
        try {
          const serverMsgs = JSON.parse(json._server_messages);
          const msgObj = JSON.parse(serverMsgs[0]);
          errorMessage = msgObj.message
            .replace(/<[^>]*>?/gm, " ")
            .replace(/\s+/g, " ")
            .trim();
        } catch (e) {}
      } else if (json.error && typeof json.error === "string") {
        errorMessage = json.error
          .replace(/<[^>]*>?/gm, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      throw {
        type: "error",
        title: "Validation Error",
        message: errorMessage,
      };
    }

    return json.data;
  } catch (err) {
    throw err;
  }
};

export const logoutUser = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    localStorage.removeItem("api_key");
    localStorage.removeItem("api_secret");

    return true;
  } catch (err) {
    localStorage.removeItem("api_key");
    localStorage.removeItem("api_secret");
    throw err;
  }
};

export const adminLogin = async (email: string, password: string) => {
  const res = await fetch("/api/auth/login/admin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  let json;

  try {
    json = await res.json();
  } catch {
    throw {
      type: "error",
      title: "Login Gagal",
      message: "Response tidak valid dari server",
      highlight: "Server tidak mengirim data JSON yang benar.",
    };
  }

  if (!res.ok || json.meta?.code !== 1000) {
    const apiCode = json.meta?.code;

    let errorDetail = {
      type: "error",
      title: "Login Gagal",
      message: "Terjadi kesalahan saat login admin.",
      highlight: json.meta?.message || "Kesalahan sistem tidak diketahui.",
    };

    switch (apiCode) {
      case 1001:
        errorDetail.message = "Akun tidak ditemukan.";
        errorDetail.highlight = "Email admin tidak terdaftar.";
        break;
      case 1002:
        errorDetail.message = "Format Input Salah.";
        errorDetail.highlight = "Periksa email dan password.";
        break;
      case 1003:
        errorDetail.message = "Kredensial Salah.";
        errorDetail.highlight = "Password tidak sesuai.";
        break;
      default:
        errorDetail.message = "Gagal Login Admin.";
        errorDetail.highlight =
          json.meta?.message || "Terjadi kesalahan pada server.";
        break;
    }

    throw errorDetail;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("api_key", json.data.api_key || "");
    localStorage.setItem("api_secret", json.data.api_secret || "");
    localStorage.setItem("company", json.data.company || "");
  }

  return json.data;
};