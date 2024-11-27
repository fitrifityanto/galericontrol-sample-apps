import express from 'express';
import { loadGaleri, addGaleri, deleteGaleri, loadGaleriById} from './utils/galeries.js';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
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

// halaman form tambah data galeri
router.get('/galeri/add', (req, res) => {
    res.render('add-galeri', {
        title: 'Form tambah data galeri',
        layout: 'layouts/main-layout',
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

    // const fileFilter = (req, file, cb) => {
    //     // Cek jika file ada
    //     if (!file) {
    //       cb(new Error('No file selected!'), false); // Kirim error jika file tidak ada
    //       return;
    //     }
    // }
    
    const upload = multer({ storage })
    
    router.post('/galeri', upload.single('gambar'), body('judul').notEmpty().withMessage('ngga boleh kosong'), (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log(errors.array())
            if (req.file) {
                fs.unlink('public/img/galeri/' + req.file.filename , async (err) => {
                    if(err) {
                       console.log(err)
                    } 
                })
            }
            res.render('add-galeri', {
                title: 'Form tambah data galeri',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                msg: req.flash('msg')
            })
        } 
        if(!req.file) {
            req.flash('msg', 'gambar tidak boleh kosong');
            res.redirect('/galeri/add');
        }
        else {
            console.log('Judul:', req.body.judul);
            console.log('gambar:', req.body.gambar);
            res.redirect('/galeri')
        }

        
        // req.file berisi data file yang di-upload
        // if (req.file) {
        //     console.log('File Uploaded:', req.file.filename);  // Nama file yang di-upload
        // } else {
        //     console.log('No file uploaded.');
        // }
    
        // res.send('Data galeri diterima!');
    });
    // router.post('/', upload.single('gambar'), 
    //     async (req, res) => {
    //         const gambar = req.file.filename;
    
    //         if (gambar) {
    //             try {
    //                 const response = await addGaleri({
    //                     judul: req.body.judul,
    //                     gambar
    //                 });
    //                 req.flash('msg', `${response.message}`);
    //                 res.redirect('/galeri/add');
    //             } catch (error) {
    //                 req.flash('msg', 'Terjadi kesalahan saat menambah data galeri.');
    //                 res.redirect('/galeri/add');
    //             }
    //         } else {
    //             req.flash('msg', 'Gambar tidak berhasil diupload');
    //             res.redirect('/galeri/add');
    //         }
    //     }
    // );

    router.get('/galeri/delete/:id', async (req, res) => {
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

router.get('/galeri/:id', async (req, res) => {
    const galeriById = await loadGaleriById(req.params.id)
    console.log(galeriById)
    res.json(galeriById)
    // res.render('add-galeri', {
    //     title: 'Form tambah data galeri',
    //     layout: 'layouts/main-layout',
    //     msg: req.flash('msg')
    // })
    })

 