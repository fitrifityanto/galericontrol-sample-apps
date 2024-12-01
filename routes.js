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
    upload.array('gambar', 3),
    (err, req, res, next) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                // return res.status(400).json({ error: 'File size is too large. Maximum allowed is 200 KB.' });
                req.flash('msgError', 'File gambar terlalu besar, maksimal 200kb');
                res.redirect('/galeri/add');
                return
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                // return res.status(400).json({ error: 'Maksimal gambar yang di pilih adalah 3!' });
                req.flash('msgError', 'Maksimal gambar yang di pilih adalah 3!');
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
            if(req.files.length) {
               for(let i = 0; i < req.files.length; i++) {
                   fs.unlink('public/img/galeri/data/' + req.files[i] , async (err) => {
                       if(err) {
                           console.log(err)
                       } 
                   })
               }
            }
        
            return res.render('add-galeri', {
                title: 'Form tambah data galeri',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                msg: req.flash('msg'),
                msgError: req.flash('msgError'),
            })
        }

        if (!req.files.length) {
            // return res.status(400).json({ error: 'Tidak ada file yang dipilih' });
            req.flash('msgError', 'Tidak ada file yang dipilih');
            res.redirect('/galeri/add');
            return
        }
        next(); 
    },

    async (req, res) => {
    // Setelah validasi berhasil, 
        const arrFilename = req.files.map(gb => gb.filename)

        const galeri = {
            judul: req.body.judul,
            gambar: arrFilename
        };
        const response = await addGaleri(galeri)

        req.flash('msg', `${response.message}`);
        res.redirect('/galeri/add');
        return
        // res.status(200).json({
        //     message: `File dan data form berhasil diupload, ${response.message}`,
        //     galeri,
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

router.get('/galeri/edit2/:id', async (req, res) => {
    const galeri = await loadGaleriById(req.params.id)
    // console.log(galeri)
    res.render('edit2-galeri', {
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
    upload.array('gambar', 999),
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
            gambar: req.body.oldGambar,
        };
        if (!errors.isEmpty()) {
            // meskipun ada error pada field selain file, tapi jika files dipilih, dia berhasil diupload, jadi harus di hapus
            if(req.files.length) {
                req.files.map(item => (
                    fs.unlink('public/img/galeri/data/' + item.filename , async (err) => {
                        if(err) {
                            console.log(err)
                        } 
                    })
                ))
            }
            
            // return res.status(400).json({ errors: errors.array() });
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
        const gambarDelete = req.body.checkbox || []
        const dataGaleri = await loadGaleriById(req.body.id)
        const filteredGambar = dataGaleri.gambar.filter(gb => !gambarDelete.includes(gb))
        const uploadGb = req.files.map(gb => gb.filename)
        const final = [...new Set([...filteredGambar, ...uploadGb])]

        if (!final.length) {
            // return res.json({ message: 'gambar tidak boleh kosong' })
            req.flash('msgError', 'gambar tidak boleh kosong');
            res.redirect(`/galeri/edit/${req.body.id}`);
            return
        }
        if (final.length > 3) {
            if(req.files.length) {
                req.files.map(item => (
                    fs.unlink('public/img/galeri/data/' + item.filename , async (err) => {
                        if(err) {
                            console.log(err)
                        } 
                    })
                ))
            }
            // return res.json({ message: 'total gambar tidak boleh lebih dari 3' })
            req.flash('msgError', 'total gambar tidak boleh lebih dari 3');
            res.redirect(`/galeri/edit/${req.body.id}`);
            return
        }
        if(gambarDelete.length) {
            for(let i=0; i<gambarDelete.length; i++) {
                fs.unlink('public/img/galeri/data/' + gambarDelete[i] , async (err) => {
                    if(err) {
                    console.log(err)
                    } 
                })
            }
        }

        const galeri = {
            id: req.body.id,
            judul: req.body.judul,
            gambar: final,
        };
        const response = await updateGaleri(galeri)
        req.flash('msg', `${response.message}`);
        res.redirect(`/galeri/${req.body.id}`);
        return
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
    for (let i=0; i<galeriById.gambar.length; i++) {
        fs.unlink('public/img/galeri/data/' + galeriById.gambar[i] , (err) => {
            if(err) {
                console.log(err)
            } 
        })
    }
    const response = await deleteGaleri(req.params.id)
    req.flash('msgSucces',` ${response.message}`)
    res.redirect('/galeri')
})

 