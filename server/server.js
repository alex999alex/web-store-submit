import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.js';
import homeRouter from './routes/home.js';
import productsRouter from './routes/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/api/images', express.static(path.join(__dirname, 'public', 'api', 'images')));


app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));


app.use(session({
  secret: 'fkldjbnfdkFTFT5efd3$$sdg89F',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: true,
    secure: false,  
    sameSite: 'lax',  
    maxAge: 3600000 
  }
}));


app.use('/api/', homeRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});