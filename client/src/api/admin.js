import axios from "./axios"



// SERVER SIDE ADMIN API CALLS
export const isAdmin = async () => {
    const res = await axios.get("/api/admin/isAdmin", { withCredentials: true })
    return res.data.isAdmin
}

export const addCategory = async (category) => {
    console.log("Category", category)
    const res = await axios.post("/api/admin/addCategory", category, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    console.log(res.data)
    return res.data
}

export const getCategories = async () => {
    const res = await axios.get("/api/admin/getCategories")
    return res.data
}

export const updateCategory = async (categoryData) => {
    console.log("Updating category:", categoryData);
    const res = await axios.put(`/api/admin/updateCategory/${categoryData._id}`, categoryData, {
        headers: { "Content-Type": "multipart/form-data" }

    })
    console.log(res.data);
    return res.data
}

export const deleteCategory = async (categoryId) => {
    console.log("Deleting category:", categoryId);
    const res = await axios.delete(`/api/admin/deleteCategory/${categoryId}`)
    return res.data
}

export const getCustomers = async () => {
    const res = await axios.get("/api/admin/customers");
    console.log(res.data)
    return res.data;
}

export const addProduct = async (product) => {
    for (let [key, value] of product.entries()) {
        console.log(key, value);
    }

    const res = await axios.post("/api/admin/addProduct", product)
    console.log(res.data)
    return res.data
}

export const getProducts = async (productId) => {
    if (productId) {
        const res = await axios.get(`/api/admin/products/${productId}`)
        return res.data
    }
    const res = await axios.get("/api/admin/products")
    return res.data
}

export const updateProduct = async (id, data) => {
    const res = await axios.patch(`/api/admin/products/${id}`, data);
    return res.data;
};

export const deleteProduct = async (productId) => {
    const res = await axios.delete(`/api/admin/products/${productId}`);
    return res.data;
}

export const deleteVariation = async (variationId) => {
    const res = await axios.delete(`/api/admin/variation/${variationId}`);
    return res.data;
}



export const addShippingFee = async ({ shippingFee, freeShippingOver }) => {
    const res = await axios.post("/api/admin/add-shipping-details", { shippingFee, freeShippingOver })
    return res.data
}

export const addCoupon = async (couponData) => {
    const res = await axios.post("/api/admin/add-coupon-details", couponData)
    return res.data
}

export const deleteCoupon = async (code) => {
    const res = await axios.delete(`/api/admin/delete-coupon?code=${code}`);
    return res.data;
};


export const deleteShippingFee = async () => {
    const res = await axios.delete("/api/admin/delete-shipping-fee")
    return res.data
}

export const getCommerceData = async () => {
    const res = await axios.get("/api/admin/get-commerce-data");
    return res.data;
}