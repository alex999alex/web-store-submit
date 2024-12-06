import express from 'express';
// import { PrismaClient } from '@prisma/client';
import pkg from '@prisma/client';
import { hashPassword, comparePassword } from '../lib/utility.js'
import passwordValidator from 'password-validator';
const { PrismaClient } = pkg;

const router = express.Router();

const prisma = new PrismaClient();

// Define the password schema
const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(8)               // Minimum length 8
  .has().lowercase()         // Must have at least 1 lowercase character
  .has().uppercase()         // Must have at least 1 uppercase character
  .has().digits(1)           // Must have at least 1 number
  .has().not().spaces();     // No spaces allowed

  router.post('/signup', async (req, res) => {
    console.log('Received signup request:', req.body); // Log request data
  
    const { email, password, firstName, lastName } = req.body;
  
    try {
      if (!email || !password || !firstName || !lastName) {
        console.error('Missing required fields');
        return res.status(400).send('Missing required fields');
      }
  
      const passwordValidationResult = passwordSchema.validate(password, { list: true });
      if (passwordValidationResult.length > 0) {
        console.error('Password validation failed:', passwordValidationResult);
        return res.status(400).json({ errors: passwordValidationResult });
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        console.error('User already exists:', email);
        return res.status(400).send('User already exists');
      }
  
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: { firstName, lastName, email, password: hashedPassword },
      });
  
      console.log('User created successfully:', user);
      res.json({ user: email });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).send('An internal server error occurred');
    }
  });
  

router.post('/login', async (req,res) => {
  // get user inputs
  const { email, password } = req.body;

  // validate the inputs
  if(!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  // find user in database
  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });
  if (!existingUser) {
    return res.status(404).send('User not found');
  }

  // compare/verify the password entered
  const passwordMatch = await comparePassword(password, existingUser.password);
  if (!passwordMatch) {
    return res.status(401).send('Invalid password');
  }

  // setup user session data
  req.session.email = existingUser.email;
  req.session.user_id = existingUser.id;
  req.session.name = existingUser.firstName + ' ' + existingUser.lastName;
  console.log('logged in user: ' + req.session.email);

  // send response
  // res.send('Login successful');
  res.json({ email: existingUser.email });

});

router.post('/logout', (req,res) => {
  req.session.destroy();
  res.send('Successful logout');
});

router.get('/getSession', (req, res) => {
  // Check if user is logged in (optional for security)
  if (!req.session.email) {
    return res.status(401).send('not logged in');
  }

  const userData = {
    customer_id: req.session.user_id, // Assuming 'user_id' maps to customer ID
    email: req.session.email,
    first_name: req.session.name ? req.session.name.split(' ')[0] : '', // Extract first name if available
    last_name: req.session.name ? req.session.name.split(' ')[1] || '' : '' // Extract last name if available (handle single name case)
  };

  res.json(userData);
});



router.get('/address', async (req,res) => {
  // Get id from the session in request.
  const currentUserId = req.session.user_id;

  const address = await prisma.address.findUnique({
    where: {
      id: currentUserId,
    }
  });

  res.json(address);
});

export default router;