import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import multer from 'multer';
import { loadGaleri, addGaleri, deleteGaleri, loadGaleriById} from './utils/galeries.js';
import { upload } from './config/multerConfig.js';


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
        photos
    })
})

// halaman form tambah data galeri
router.get('/galeri/add', (req, res) => {
    res.render('add-galeri', {
        title: 'Form tambah data galeri',
        layout: 'layouts/main-layout',
        msg: req.flash('msg'),
        msgError: req.flash('msgError'),
    })
})

// Route untuk menambah data galeri
router.post(
    '/galeri',
    upload,
    (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
        // return res.status(400).json({ error: 'File size is too large. Maximum allowed is 200 KB.' });
        req.flash('msgError', 'File gambar terlalu besar, maksimal 200kb');
        res.redirect('/galeri/add');
        return
        }
    }
    if (err) {
        // return res.status(400).json({ error: err.message });
        req.flash('msgError', `${err.message}`);
        res.redirect('/galeri/add');
        return
    }
    next(); 
    },
    body('judul').notEmpty().withMessage('Judul tidak boleh kosong').isLength({ max: 50 }).withMessage('Judul tidak boleh lebih dari 50 karakter'),

    (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        // karena file berhasil upload, harus di hapus
        if(req.file) {
            fs.unlink('public/img/galeri/' + req.file.filename , async (err) => {
                if(err) {
                    console.log(err)
                } 
            })
        }
        return res.render('add-galeri', {
            title: 'Form tambah data galeri',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            msg: req.flash('msg'),
            msgError: req.flash('msgError'),
        })
    }

    if (!req.file) {
        // return res.status(400).json({ error: 'Tidak ada file yang dipilih' });
        req.flash('msgError', 'Tidak ada file yang dipilih');
        res.redirect('/galeri/add');
        return
    }
    next(); 
    },

    async (req, res) => {
    // Setelah validasi berhasil, 
    const formData = {
        judul: req.body.judul,
        gambar: req.file.filename
    };
    const response = await addGaleri(formData)
    req.flash('msg', `${response.message}`);
    res.redirect('/galeri/add');
    return
    // res.status(200).json({
    //     message: 'File dan data form berhasil diupload',
    //     formData
    // });
    }
);

router.get('/galeri/:id', async (req, res) => {
    const galeriById = await loadGaleriById(req.params.id)
    console.log(galeriById)
    res.json(galeriById)
    })

router.delete('/galeri/:id', async (req, res) => {
    const galeriById = await loadGaleriById(req.params.id)
    fs.unlink('public/img/galeri/' + galeriById.gambar , async (err) => {
        if(err) {
            console.log(err)
        } 
        const response = await deleteGaleri(req.params.id)
        req.flash('msg',` ${response.message}`)
        res.redirect('/galeri')
    })
})

 