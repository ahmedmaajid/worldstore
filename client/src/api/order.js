import axios from "./axios";

export const createOrder = async (data) => {
    console.log(data)
    const res = await axios.post("/api/orders/create", data)
    return res.data;
}

export const directOrder = async (data) => {
    console.log(data);
    const res = await axios.post("/api/orders/create-direct", data);
    return res.data
}
export const fetchOrderById = async (id) => {
    const res = await axios.get(`/api/orders/fetch-order/${id}`);
    return res.data
}
export const fetchOrders = async () => {
    const res = await axios.get("/api/orders/fetch-all-orders");
    return res.data
}

export const cancelOrder = async (id) => {
    const res = await axios.put(`/api/orders/cancel/${id}`);
    return res.data
}
