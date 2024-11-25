import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const loadGaleri = async () => {
    try {      
        const response =  await axios.get(`${process.env.API_URL}`)
         return response.data
    } catch (error) {
        console.error('Error fetching photos:', error) 
        return []   
    }
}

// menambahkan data contact baru
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

const deleteGaleri = async (id) => {
    try {      
        const response =  await axios.delete(`${process.env.API_URL}/${id}`)
         return response.data
    } catch (error) {
        console.error('Error fetching photos:', error) 
        return []   
    }
}

export { loadGaleri, addGaleri, deleteGaleri }