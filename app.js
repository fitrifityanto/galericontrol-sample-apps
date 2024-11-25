import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { loadGaleri, addGaleri, deleteGaleri} from './utils/galeries.js';
import { body, validationResult } from 'express-validator';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';

dotenv.config();

const app = express()
const PORT = process.env.PORT

// gunakan EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

//  built-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))

// configurasi flash
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());


app.get('/', async (req, res) => {
   const photos = await loadGaleri()
   const latestPhotos = photos.slice(0,5)
   res.render('index', { 
     name: 'fitriningtyas', 
     title: 'galeri-foto-app',
     layout: 'layouts/main-layout',
     photos: latestPhotos
   })
})

app.get('/about', (req, res) => {
  res.render('about', { 
    layout: 'layouts/main-layout',
    title: 'halaman About', 
  })
  })

  app.get('/galeri', async (req, res) => {
    const photos = await loadGaleri()
    res.render('galeri', { 
      title: 'galeri',
      layout: 'layouts/main-layout',
      photos,
      msg: req.flash('msg')
    })
 })

  // halaman form tambah data galeri
app.get('/galeri/add', (req, res) => {
  res.render('add-galeri', {
    title: 'Form tambah data galeri',
    layout: 'layouts/main-layout',
    msg: req.flash('msg')
  })
})

app.get('/galeri/delete/:id', async(req, res) => {
 const response = await deleteGaleri(req.params.id)
  req.flash('msg',` ${response.message}`)
  res.redirect('/galeri')
})

app.post('/', body('gambar').notEmpty().withMessage('tidak boleh kosong') , async (req, res) => {
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
  // console.log(response.message)
  res.redirect('/galeri/add')
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`)
})