import express from 'express';
import cors from 'cors';
import session from 'express-session';
import usersRouter from './routes/users.js';
import homeRouter from './routes/home.js';
import productsRouter from './routes/products.js';

const port = process.env.PORT || 3000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


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
