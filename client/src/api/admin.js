import axios from "./axios"

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
    console.log(res.data);
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