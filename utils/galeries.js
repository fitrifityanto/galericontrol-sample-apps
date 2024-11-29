import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const loadGaleri = async () => {
    try {      
        const response =  await axios.get(`${process.env.API_URL}`)
         return response.data
    } catch (error) {
        console.error('Error fetching photos:', response.data.message) 
        return []   
    }
}

const loadGaleriById = async (id) => {
    try {      
        const response =  await axios.get(`${process.env.API_URL}/${id}`)
         return response.data
    } catch (error) {
        console.error('Error fetching photos:', error) 
        return []   
    }
}
// menambahkan data galeri baru
const addGaleri = async (galeri) => {
    try {
       const response = await axios.post(`${process.env.API_URL}`, {
        judul: galeri.judul,
        gambar: galeri.gambar,
    })
        return response.data
       
    } catch (error) {
        console.error('Error fetching photos:', error) 
        return []   
    }
}

const updateGaleri = async (galeri) => {
    try {
       const response = await axios.put(`${process.env.API_URL}/${galeri.id}`, {
        id: galeri.id,
        judul: galeri.judul,
        gambar: galeri.gambar,
    })
        return response.data
       
    } catch (error) {
        console.error('Error fetching photos:', error) 
        return []   
    }
}

const deleteGaleri = async (id) => {
    try {      
        const response =  await axios.delete(`${process.env.API_URL}/${id}`)
         return response.data
    } catch (error) {
        console.error('Error fetching photos:', error) 
        return []   
    }
}

export { loadGaleri, loadGaleriById, addGaleri, deleteGaleri, updateGaleri }