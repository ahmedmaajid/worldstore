import axios from "./axios"

export const createUser = async (formData) => {
    const res = await axios.post("/api/auth/create-user", formData, { withCredentials: true });
    console.log(res.data)
    return res.data;
}
export const loginUser = async ({ password, email }) => {
    const res = await axios.post("/api/auth/login", { password, email }, { withCredentials: true });
    console.log(res.data)
    return res.data;
}