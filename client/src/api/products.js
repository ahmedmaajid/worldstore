import axios from "./axios";

export const getProducts = async () => {
    const res = await axios.get("/api/products/fetch-products");
    return res.data;
};

export const getProductByCategory = async (slug) => {
    const res = await axios.get("/api/products/get-products-by-category", { params: { slug } });
    return res.data;
};

// api/products.js
export const getProductByCategoryIds = async (ids) => {
    const res = await axios.post("/api/products/get-products-by-category-ids", {
        ids,
    });
    return res.data;
};


export const getCategories = async () => {
    const res = await axios.get("/api/products/fetch-categories");
    return res.data;
}

export const getCategoryDataBySlug = async (slug) => {
    const res = await axios.get("/api/products/get-category-data", {
        params: { slug },
    });
    return res.data;
};


export const getProduct = async (slug) => {
    const res = await axios.get(`/api/products/get-product/${slug}`);
    console.log("res", res)
    return res.data;
};


// Adding to cart and Wishlist
export const addToCart = async ({ item }) => {
    const res = await axios.post("/api/products/add-to-cart", { item });
    return res.data;
}

export const addToCartFromWishlist = async (item) => {
    try {
        console.log(item)
        const res = await axios.post(`/api/products/add-to-cart-from-wishlist/`, item);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export const removeCartItem = async (id) => {
    console.log(id)
    const res = await axios.delete(`/api/products/remove-cart-item/${id}`)
    return res.data
}

export const addToWishlist = async ({ item }) => {
    const res = await axios.post("/api/products/add-to-wishlist", { item });
    return res.data;
}

// Getting Cart Items
export const getCartItems = async () => {
    const res = await axios.get(`/api/products/get-cart-items`)
    return res.data
}

export const removeWishlistItem = async (id) => {
    const res = await axios.delete(`/api/products/remove-wishlist-item/${id}`)
    return res.data;
}






export const getWishlistData = async () => {
    const res = await axios.get("/api/products/get-wishlist-data");
    return res.data
}