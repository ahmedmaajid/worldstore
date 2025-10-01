import axios from "axios";
const instance = axios.create({
    baseURL: "https://worldstore.onrender.com",
    withCredentials: true,
});
export default instance;


