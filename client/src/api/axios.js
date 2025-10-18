import axios from "axios";

const baseURL =
    import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://worldstore.onrender.com";

const instance = axios.create({
    baseURL,
    withCredentials: true,
});

export default instance;
