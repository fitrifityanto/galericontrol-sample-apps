import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import { loadGaleri } from './utils/galeries.js';
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
   res.render('index', { 
     author: 'fitriningtyas', 
     title: 'galeri-foto-app',
     layout: 'layouts/main-layout',
     photos
   })
})

app.get('/about', (req, res) => {
  res.render('about', { 
    layout: 'layouts/main-layout',
    title: 'halaman About', 
  })
  })


app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`Example app listening on http://localhost:${PORT}`)
})