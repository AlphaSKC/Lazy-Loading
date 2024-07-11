import axios from "axios";

const getModels = async () => {
    try {
        const response = await axios.get('https://localhost:7029/Modelos');
        return response.data.result;
    } catch (e: any) {
        console.error('Error al obtener los modelos:', e.response ? e.response.data : e.message);
    }
}

const createModel = async (model: any) => {
    try {
        const response = await axios.post('https://localhost:7029/Modelos', model);
        return response.data;
    } catch (e: any) {
        console.error('Error al crear el modelo:', e.response ? e.response.data : e.message);
        throw e;
    }
}

const updateModel = async (model: any) => {
    try {
        const response = await axios.put(`https://localhost:7029/Modelos/${model.pkModelo}`, model);
        return response.data;
    } catch (e: any) {
        console.error('Error al actualizar el modelo:', e.response ? e.response.data : e.message);
    }
}

const deleteModel = async (id: number) => {
    try {
        const response = await axios.delete(`https://localhost:7029/Modelos/${id}`);
        return response.data;
    } catch (e: any) {
        console.error('Error al eliminar el modelo:', e.response ? e.response.data : e.message);
    }
}

const getModelByIdUpdate = async (id: number) => {
    try {
        const response = await axios.get(`https://localhost:7029/Modelos/update/${id}`);
        return response.data.result;
    } catch (e: any) {
        console.error('Error al obtener el modelo:', e.response ? e.response.data : e.message);
    }

}

export { getModels, createModel, updateModel, deleteModel, getModelByIdUpdate }
