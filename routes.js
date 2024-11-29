import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs';
import multer from 'multer';
import { loadGaleri, addGaleri, deleteGaleri, loadGaleriById, updateGaleri, deleteAllGaleri} from './utils/galeries.js';
import { upload } from './config/multerConfig.js';


export const router = express.Router()

router.get('/', async (req, res) => {
    const galeries = await loadGaleri()
    const latestGaleries = galeries.slice(0,6)
    res.render('index', { 
      name: 'fitriningtyas', 
      title: 'galeri-foto-app',
      layout: 'layouts/main-layout',
      galeries: latestGaleries
    })
 })
 
router.get('/about', (req, res) => {
    res.render('about', { 
        layout: 'layouts/main-layout',
        title: 'halaman About', 
})
})
 
router.get('/galeri', async (req, res) => {
    const galeries = await loadGaleri()
    res.render('galeri', { 
        title: 'galeri',
        layout: 'layouts/main-layout',
        galeries,
        msgSucces: req.flash('msgSucces'),
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
            fs.unlink('public/img/galeri/data' + req.file.filename , async (err) => {
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
    const galeri = {
        judul: req.body.judul,
        gambar: req.file.filename
    };
    const response = await addGaleri(galeri)
    req.flash('msg', `${response.message}`);
    res.redirect('/galeri/add');
    return
    // res.status(200).json({
    //     message: 'File dan data form berhasil diupload',
    //     formData
    // });
    }
);

// halaman form edit data galeri
router.get('/galeri/edit/:id', async (req, res) => {
    const galeri = await loadGaleriById(req.params.id)
    // console.log(galeri)
    res.render('edit-galeri', {
        title: 'Form Edit data galeri',
        layout: 'layouts/main-layout',
        galeri,
        msg: req.flash('msg'),
        msgError: req.flash('msgError'),
    })
})

// Route untuk mengubah data galeri
router.put(
    '/galeri/:id',
    upload,
    (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
        // return res.status(400).json({ error: 'File size is too large. Maximum allowed is 200 KB.' });
        req.flash('msgError', 'File gambar terlalu besar, maksimal 200kb');
        res.redirect(`/galeri/edit/${req.body.id}`);
        return
        }
    }
    if (err) {
        // return res.status(400).json({ error: err.message });
        req.flash('msgError', `${err.message}`);
        res.redirect(`/galeri/edit/${req.body.id}`);
        return
    }
    next(); 
    },
    body('judul').notEmpty().withMessage('Judul tidak boleh kosong').isLength({ max: 50 }).withMessage('Judul tidak boleh lebih dari 50 karakter'),

    (req, res, next) => {
    const errors = validationResult(req);
    const galeri = {
        id: req.body.id,
        judul: req.body.judul,
        gambar: req.body.oldGambar
    };
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        // meskipun ada error pada field selain file, tapi karena file berhasil diupload, harus di hapus
        if(req.file) {
            fs.unlink('public/img/galeri/' + req.file.filename , async (err) => {
                if(err) {
                    console.log(err)
                } 
            })
        }

        return res.render('edit-galeri', {
            title: 'Form ubah data galeri',
            layout: 'layouts/main-layout',
            galeri,
            errors: errors.array(),
            msg: req.flash('msg'),
            msgError: req.flash('msgError'),
        })
    }
    next(); 
    },

    async (req, res) => {
    // Setelah validasi berhasil, 
        if(req.file) {
            // jika ada file gambar baru, hapus gambar lama
            fs.unlink('public/img/galeri/' + req.body.oldGambar , async (err) => {
                if(err) {
                    console.log(err)
                } 
            })
        }
        const gambar = req.file ? req.file.filename : req.body.oldGambar
        const galeri = {
            id: req.body.id,
            judul: req.body.judul,
            gambar,
        };
        const response = await updateGaleri(galeri)
        req.flash('msg', `${response.message}`);
        res.redirect(`/galeri/${req.body.id}`);
        return
        // return res.status(200).json({
        //     message: 'File dan data form berhasil diupload',
        //     formData,
        //     msg: response.message
        // });
    }
);

router.get('/galeri/:id', async (req, res) => {
    const galeri = await loadGaleriById(req.params.id)
    res.render('detail-galeri', {
        title: 'Detail galeri',
        layout: 'layouts/main-layout',
        galeri,
        msg: req.flash('msg'),
    })
    })

    // menghapus semua data galeri
router.delete('/galeri', async (req, res) => {
    const response = await deleteAllGaleri()
    fs.rm('public/img/galeri/data', { recursive: true, force: true },  err => {
        if(err) console.log(err)
    })
    req.flash('msgSucces',` ${response.message}`)   
    res.redirect('/galeri')
})

    // menghapus 1 data berdasarkan id
router.delete('/galeri/:id', async (req, res) => {
    const galeriById = await loadGaleriById(req.params.id)
    fs.unlink('public/img/galeri/data' + galeriById.gambar , (err) => {
        if(err) {
            console.log(err)
        } 
    })
    const response = await deleteGaleri(req.params.id)
    req.flash('msgSucces',` ${response.message}`)
    res.redirect('/galeri')
})

 