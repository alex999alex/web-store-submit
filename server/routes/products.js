import express from 'express';
import multer from 'multer';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

import fs from 'fs';

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/api/images/';
        cb(null, uploadPath); 
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop(); 
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext;
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage: storage });



const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});


router.get('/all', async (req, res) => {
    const products = await prisma.product.findMany();
    
    res.json(products);
});


router.get('/get/:id', async (req, res) => {
    const id = req.params.id;
  
   
    const idRegex = /^\d+$/;
    if (!idRegex.test(id)) {
      return res.status(400).send('Invalid id format. Please provide an integer.');
    }
  
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('product not found');
    }
});


router.post('/create', upload.single('image'), async (req, res) => {
    const { name, description, cost } = req.body;
    const filename = req.file ? req.file.filename : null;

    
    if (!name || !description || !cost) {
        res.status(400).send('All fields are required.');
        return;
    }

   
    const parsedCost = parseFloat(cost);
    if (isNaN(parsedCost)) {
        res.status(400).send('Invalid cost value.');
        return;
    }

    const product = await prisma.product.create({
        data: {
            name: name,
            description: description,
            cost: parsedCost,  
            filename: filename
        }
    });

    res.json(product);
});


   
    router.put('/update/:id', upload.single('image'), async(req, res) => {

      
        const id = req.params.id;
        const { name, description, cost } = req.body;
        
        const newFilename = req.file ? req.file.filename : null;

        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid id.' });
        }

       
        if (!name || !description || !type || !cost) {
            return res.status(400).json({ message: 'First name, last name, type, cost are required.' });
        }


        const product = await prisma.product.findUnique({
            where: {
            id: parseInt(id)
            }
        });
        
     
        if (product === null) {
            return res.status(404).json({ message: 'product not found.' });
        }
        

        if (newFilename && product.filename) {
            fs.unlink(`public/api/images/${product.filename}`, (err) => {
            if (err) {
                console.error(err);
            }
            });
        }

 
        const updatedproduct = await prisma.product.update({
            where: {
            id: parseInt(id)
            },
            data: {
            name: name,
            description: description,
   
            cost: cost || null,
            filename: newFilename || product.filename 
            }
        });
        
        res.json(updatedproduct);
    });


router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

 
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }


    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    });

  
    if (product === null) {
        return res.status(404).json({ message: 'product not found.' });
    }


    if (product.filename) {
        fs.unlink(`public/api/images/${product.filename}`, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }


    const deletedproduct = await prisma.product.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.send({ message: 'product deleted.' });
});



router.post('/purchase', async (req, res) => {
    const {
        street,
        city,
        province,
        country,
        postal_code,
        credit_card,
        credit_expire,
        credit_cvv,
        cart,
        invoice_amt,
        invoice_tax,
        invoice_total
    } = req.body;

 
    const userId = req.session.user_id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
    }


    if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart || !invoice_amt || !invoice_tax || !invoice_total) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {

        const purchase = await prisma.$transaction(async (prisma) => {

            const newPurchase = await prisma.purchase.create({
                data: {
                    customer_id: userId,
                    street,
                    city,
                    province,
                    country,
                    postal_code,
                    credit_card,
                    credit_expire,
                    credit_cvv,
                    invoice_amt: parseFloat(invoice_amt),
                    invoice_tax: parseFloat(invoice_tax),
                    invoice_total: parseFloat(invoice_total),
                    order_date: new Date(),
                },
            });

            const purchase_id = newPurchase.purchase_id;


            const cartItems = cart.split(',').map(Number);
            const productCounts = {};
            for (const productId of cartItems) {
                productCounts[productId] = (productCounts[productId] || 0) + 1;
            }


            const purchaseItems = [];
            for (const [productId, quantity] of Object.entries(productCounts)) {
                purchaseItems.push({
                    purchase_id,
                    product_id: parseInt(productId),
                    quantity,
                });
            }

            await prisma.purchaseItem.createMany({
                data: purchaseItems,
            });

            return newPurchase;
        });

        res.json({ message: 'Purchase completed successfully.', purchase });
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ message: 'An error occurred while processing your purchase.' });
    }
});



export default router;

