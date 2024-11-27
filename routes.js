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

    const fileFilter = (req, file, cb) => {
        const filetypes = /jpeg|jpg/;  // Hanya menerima .jpg dan .jpeg
        const mimetype = filetypes.test(file.mimetype);
      
        if (mimetype) {
          return cb(null, true);
        } else {
          cb(new Error('Hanya file JPG atau JPEG yang diperbolehkan'), false);
        }
      };
      
    
    const upload = multer({ 
        storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: 200 * 1024, // 200 KB dalam byte
          }
     }).single('gambar')


// Route untuk menangani form dan file upload dengan validasi
router.post(
    '/galeri',
    upload,
    (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size is too large. Maximum allowed is 200 KB.' });
        }
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next(); 
    },
    body('judul').notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),

    (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'Tidak ada file yang dipilih' });
    }

    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/jpg') {
        return res.status(400).json({ error: 'Hanya file JPG atau JPEG yang diperbolehkan' });
    }
    next(); 
    },

    (req, res) => {
    // Setelah validasi berhasil, lakukan response sukses
    const formData = {
        judul: req.body.judul,
    };

    res.status(200).json({
        message: 'File dan data form berhasil diupload',
        file: req.file,
        formData: formData,
    });
    }
);



// router.post('/galeri', 
//     (req, res, next) => {
//         upload(req, res, (err) => {
//             // Tangani error dari Multer
//     if (err instanceof multer.MulterError) {
//         return res.status(400).json({ error: err.message });
//     } else if (err) {
//         return res.status(400).json({ error: err.message });
//     }

//     // Memeriksa apakah file diupload
//     if (!req.file) {
//         return res.status(400).json({ error: 'Tidak ada file yang dipilih' });
//     }

//     const formData = {
//         judul: req.body.judul,  // Contoh input form teks
//       };
  
//       // Mengembalikan hasil response
//       res.status(200).json({
//         message: 'File dan data form berhasil diupload',
//         file: req.file,  // Informasi file yang diupload
//         formData: formData,  // Data form selain file
//       });
//     })
//     next()
//     },
//     body('judul').notEmpty(), 
//      (req, res) => {
//         const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 // return res.render('add-galeri', {
//                 //     title: 'Form tambah data galeri',
//                 //     layout: 'layouts/main-layout',
//                 //     errors: errors.array(),
//                 //     // msg: req.flash('msg')
//                 // })
//       return res.status(400).json({ errors: errors.array() });
//     }
       
//      }
//      )
    
    // router.post('/galeri', upload, 
    //     body('judul').notEmpty().withMessage('ngga boleh kosong'), (req, res) => {
    //     const errors = validationResult(req);
    //     if(!errors.isEmpty()) {
    //         console.log(errors.array())
    //         if (req.file) {
    //             fs.unlink('public/img/galeri/' + req.file.filename , async (err) => {
    //                 if(err) {
    //                    console.log(err)
    //                 } 
    //             })
    //         }
    //         res.render('add-galeri', {
    //             title: 'Form tambah data galeri',
    //             layout: 'layouts/main-layout',
    //             errors: errors.array(),
    //             msg: req.flash('msg')
    //         })
    //     } 
    //     // if(!req.file) {
    //     //     req.flash('msg', 'gambar tidak boleh kosong');
    //     //     res.redirect('/galeri/add');
    //     // }
    //     else {

    //         res.redirect('/galeri')
    //     }
    //         console.log('Judul:', req.body.judul);
    //         console.log('gambar:', req.body.gambar);
    // });

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

 