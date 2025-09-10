import axios from "./axios";

export const checkAuth = async () => {
  try {
    const res = await axios.get("/api/auth/check", { withCredentials: true });
    return res.data.isLoggedIn;
  } catch {
    return false;
  }
};
