import express from 'express';
import { loadGaleri, addGaleri, deleteGaleri} from './utils/galeries.js';
import { body, validationResult } from 'express-validator';

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
 
router.post('/', body('gambar').notEmpty().withMessage('tidak boleh kosong') , async (req, res) => {
    const result = validationResult(req)
    if(!result.isEmpty()) { 
        res.render('add-galeri', {
        title: 'Form tambah data galeri',
        layout: 'layouts/main-layout',
        errors: result.array()
    })
    return;
    // res.status(400).json({ errors: result.array() })
    }
    const response = await addGaleri(req.body)
    req.flash('msg',` ${response.message}`)
    res.redirect('/galeri/add')
})
 