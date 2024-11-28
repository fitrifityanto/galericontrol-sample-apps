import multer from 'multer';
import path from 'path';

// ------ konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/galeri')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const fileExt = path.extname(file.originalname)
        const baseName = path.basename(file.originalname, fileExt).replace(/\s+/g, '').toLowerCase()
        const filename = file.fieldname + '-' + baseName + '-' + uniqueSuffix + fileExt
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
    fileFilter,
    limits: {
        fileSize: 200 * 1024, // 200 KB dalam byte
        }
    }).single('gambar')
// ------

export { upload }