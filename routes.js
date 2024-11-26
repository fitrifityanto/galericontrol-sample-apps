import express from 'express';
import { loadGaleri, addGaleri, deleteGaleri} from './utils/galeries.js';
import { validationResult } from 'express-validator';
import multer from 'multer';

export const router = express.Router()

router.get('/', async (req, res) => {
    const photos = await loadGaleri()
    const latestPhotos = photos.slice(0,5)
    res.render('index', { 
      name: 'fitriningtyas', 
      title: 'galeri-foto-app',
      layout: 'layouts/main-layout',
      photos: latestPhotos
    })
 })
 
router.get('/about', (req, res) => {
    res.render('about', { 
        layout: 'layouts/main-layout',
        title: 'halaman About', 
})
})
 
router.get('/galeri', async (req, res) => {
    const photos = await loadGaleri()
    res.render('galeri', { 
        title: 'galeri',
        layout: 'layouts/main-layout',
        photos,
        msg: req.flash('msg')
    })
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/galeri')
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + file.originalname
        cb(null, filename)
    }
})

const upload = multer({ storage })
 
// halaman form tambah data galeri
router.get('/galeri/add', (req, res) => {
res.render('add-galeri', {
    title: 'Form tambah data galeri',
    layout: 'layouts/main-layout',
    msg: req.flash('msg')
})
})
 
router.get('/galeri/delete/:id', async(req, res) => {
    const response = await deleteGaleri(req.params.id)
    req.flash('msg',` ${response.message}`)
    res.redirect('/galeri')
})
 
router.post('/', upload.single('gambar') , async (req, res) => {
    const result = validationResult(req)
    if(!result.isEmpty()) { 
        res.render('add-galeri', {
        title: 'Form tambah data galeri',
        layout: 'layouts/main-layout',
        errors: result.array()
    })
    return;
    }
    if (req.file) {
        // Ambil nama file gambar setelah upload
        const gambar = req.file.filename;
    
        // Panggil fungsi untuk menambahkan data galeri baru ke API
        const response = await addGaleri({
          judul: req.body.judul,
          gambar: gambar, // Hanya nama file yang disimpan
        });
        console.log('berhasil')
        req.flash('msg', `${response.message}`);
      } else {
        req.flash('msg', 'Gambar tidak berhasil diupload');
      }
    res.redirect('/galeri/add')
})
 