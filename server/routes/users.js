import express from 'express';
import pkg from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js'
const { PrismaClient } = pkg;

const router = express.Router();

const prisma = new PrismaClient();

router.post('/signup', async (req,res) => {

  const { email, password, firstName, lastName } = req.body;


  if(!email || !password || !firstName || !lastName) {
    return res.status(400).send('Missing required fields');
  }


  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });
  if (existingUser) {
    return res.status(400).send('User already exists');
  }


  const hashedPassword = await hashPassword(password);


  const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword
      },
    });


  res.json({'user' : email});
});

router.post('/login', async (req,res) => {

  const { email, password } = req.body;


  if(!email || !password) {
    return res.status(400).send('Missing required fields');
  }


  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });
  if (!existingUser) {
    return res.status(404).send('User not found');
  }

 
  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password');
  }


  req.session.email = existingUser.email;
  req.session.user_id = existingUser.id;
  req.session.name = existingUser.firstName + ' ' + existingUser.lastName;
  console.log('logged in user: ' + req.session.email);


  res.json({ email: existingUser.email });

});

router.post('/logout', (req,res) => {
  req.session.destroy();
  res.send('Successful logout');
});

router.get('/getSession', (req,res) => {
 
  res.json({ 'user' : req.session.email});
});

router.get('/address', async (req,res) => {

  const currentUserId = req.session.user_id;

  const address = await prisma.address.findUnique({
    where: {
      id: currentUserId,
    }
  });

  res.json(address);
});

export default router;
//1