import axios from "axios";

const getBrands = async () => {
    try {
        const response = await axios.get('https://localhost:7029/Marcas');
        return response.data.result;
    } catch (e:any) {
        console.error('Error al obtener las marcas:', e.response ? e.response.data : e.message);
    }
}

const createBrand = async (brand: any) => {
    try {
        const response = await axios.post('https://localhost:7029/Marcas', brand);
        return response.data;
    } catch (e: any) {
        console.error('Error al crear la marca:', e.response ? e.response.data : e.message);
        throw e;
    }
}

const updateBrand = async (brand: any) => {
    try {
        const response = await axios.put(`https://localhost:7029/Marcas/${brand.pkMarca}`, brand);
        return response.data;
    } catch (e: any) {
        console.error('Error al actualizar la marca:', e.response ? e.response.data : e.message);
    }
}

const deleteBrand = async (id: number) => {
    try {
        const response = await axios.delete(`https://localhost:7029/Marcas/${id}`);
        return response.data;
    } catch (e: any) {
        console.error('Error al eliminar la marca:', e.response ? e.response.data : e.message);
    }
}
export { getBrands, createBrand, updateBrand, deleteBrand }
