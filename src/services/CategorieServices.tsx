import axios from "axios";

const getCategories = async () => {
    try {
        const response = await axios.get('https://localhost:7029/Categorias');
        return response.data.result;
    } catch (e: any) {
        console.error('Error al obtener las categorias:', e.response ? e.response.data : e.message);
    }
}

const createCategory = async (category: any) => {
    try {
        const response = await axios.post('https://localhost:7029/Categorias', category);
        return response.data;
    } catch (e: any) {
        console.error('Error al crear la categoria:', e.response ? e.response.data : e.message);
        throw e;
    }
}

const updateCategory = async (category: any) => {
    try {
        const response = await axios.put(`https://localhost:7029/Categorias/${category.pkCategoria}`, category);
        return response.data;
    } catch (e: any) {
        console.error('Error al actualizar la categoria:', e.response ? e.response.data : e.message);
    }
}

const deleteCategory = async (id: number) => {
    try {
        const response = await axios.delete(`https://localhost:7029/Categorias/${id}`);
        return response.data;
    } catch (e: any) {
        console.error('Error al eliminar la categoria:', e.response ? e.response.data : e.message);
    }
}

export { getCategories, createCategory, updateCategory, deleteCategory}
