import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const loadGaleri = async () => {
    try {      
        const response =  await axios.get(process.env.API_URL)
         return response.data
    } catch (error) {
        console.error('Error fetching photos:', error) 
        return []   
    }
}

export { loadGaleri }