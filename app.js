import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import { router as routes } from './routes.js'
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const app = express()
const PORT = process.env.PORT

// Mendapatkan path yang setara dengan __dirname di ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(methodOverride('_method'));

// gunakan EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));


// configurasi flash
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());

app.use(routes);



app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`aplikasi ini berjalan di http://localhost:${PORT}`)
})