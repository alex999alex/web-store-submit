import express from 'express';
import pkg from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js'
import passwordValidator from 'password-validator';
const { PrismaClient } = pkg;

const router = express.Router();
const prisma = new PrismaClient();

const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)
  .has().lowercase()
  .has().uppercase()
  .has().digits(1)
  .has().not().spaces();

router.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send('Missing required fields');
  }

  const passwordValidationResult = passwordSchema.validate(password, { list: true });
  if (passwordValidationResult.length > 0) {
    const errorMessages = passwordValidationResult.map((rule) => {
      switch (rule) {
        case 'min': return 'Password must be at least 8 characters long.';
        case 'lowercase': return 'Password must have at least one lowercase letter.';
        case 'uppercase': return 'Password must have at least one uppercase letter.';
        case 'digits': return 'Password must have at least one number.';
        case 'spaces': return 'Password must not contain spaces.';
        default: return 'Invalid password.';
      }
    });
    return res.status(400).json({ message: 'Password does not meet the required policy.', errors: errorMessages });
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

  res.json({ user: email });
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

  res.json({ email: existingUser.email });
});

router.post('/logout', (req,res) => {
  req.session.destroy();
  res.send('Successful logout');
});

router.get('/getSession', (req, res) => {
  if (!req.session.email) {
    return res.status(401).send('not logged in');
  }

  const userData = {
    customer_id: req.session.user_id,
    email: req.session.email,
    first_name: req.session.name ? req.session.name.split(' ')[0] : '',
    last_name: req.session.name ? req.session.name.split(' ')[1] || '' : ''
  };

  res.json(userData);
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