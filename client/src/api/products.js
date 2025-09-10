import axios from "./axios";

export const getProducts = async () => {
    const res = await axios.get("/products");
    return res.data;
};

export const getProductById = async (id) => {
    const res = await axios.get(`/products/${id}`);
    return res.data;
};