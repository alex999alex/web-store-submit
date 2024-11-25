import express from 'express';
import multer from 'multer';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
// const prisma = new PrismaClient();
// import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const router = express.Router();

// Multer setup
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/api/images/'); // save uploaded files in `public/api/images` folder
//     },
//     filename: function (req, file, cb) {
//         const ext = file.originalname.split('.').pop(); // get file extension
//         const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
//         cb(null, uniqueFilename);
//     }
// });
// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/api/images/';
        cb(null, uploadPath); // Ensure this matches your existing directory
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop(); // Get file extension
        const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext;
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage: storage });


// Prisma setup
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Get all products
router.get('/all', async (req, res) => {
    const products = await prisma.product.findMany();
    // res.send('All products');
    res.json(products);
});

// Get a product by id
router.get('/get/:id', async (req, res) => {
    const id = req.params.id;
  
    // Validate id
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

// Add a new product
router.post('/create', upload.single('image'), async (req, res) => {
    const { name, description, cost } = req.body;
    const filename = req.file ? req.file.filename : null;

    // Validate input
    if (!name || !description || !cost) {
        res.status(400).send('All fields are required.');
        return;
    }

    // Convert cost to a float
    const parsedCost = parseFloat(cost);
    if (isNaN(parsedCost)) {
        res.status(400).send('Invalid cost value.');
        return;
    }

    const product = await prisma.product.create({
        data: {
            name: name,
            description: description,
            cost: parsedCost,  // Use parsed cost here
            filename: filename
        }
    });

    res.json(product);
});


    // Update a product by id
    router.put('/update/:id', upload.single('image'), async(req, res) => {

        // capture the inputs
        const id = req.params.id;
        const { name, description, cost } = req.body;
        // const { name, description, type, cost } = req.body;
        const newFilename = req.file ? req.file.filename : null;

        // validate the id
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid id.' });
        }

        // validate required fields
        if (!name || !description || !type || !cost) {
            return res.status(400).json({ message: 'First name, last name, type, cost are required.' });
        }

        // to-do: add additional validations (optional)

        // Find the product by id (if not found, return 404)
        const product = await prisma.product.findUnique({
            where: {
            id: parseInt(id)
            }
        });
        
        // If product not found, return 404
        if (product === null) {
            return res.status(404).json({ message: 'product not found.' });
        }
        
        // Delete old file if new file uploaded.
        if (newFilename && product.filename) {
            fs.unlink(`public/api/images/${product.filename}`, (err) => {
            if (err) {
                console.error(err);
            }
            });
        }

        // Update the database record
        const updatedproduct = await prisma.product.update({
            where: {
            id: parseInt(id)
            },
            data: {
            name: name,
            description: description,
            // type: type,
            cost: cost || null,
            filename: newFilename || product.filename // save the new filename or old filename if no new file uploaded
            }
        });
        
        res.json(updatedproduct);
    });

// Delete a product by id
router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    // verify id is a number
    if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id.' });
    }

    // Find the product by id (if not found, return 404)
    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    // If product not found, return 404
    if (product === null) {
        return res.status(404).json({ message: 'product not found.' });
    }

    // delete the file (if product has one)
    if (product.filename) {
        fs.unlink(`public/api/images/${product.filename}`, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    // delete the record with prisma
    const deletedproduct = await prisma.product.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.send({ message: 'product deleted.' });
});


// // Purchase a product
// router.post('/purchase', async (req, res) => {
//     const { productId, quantity } = req.body;

//     // Validate input
//     if (!productId || !quantity || isNaN(quantity)) {
//         return res.status(400).json({ message: 'All fields (productId, quantity) are required.' });
//     }

//     // Ensure the user is logged in
//     const userId = req.session.user_id;
//     if (!userId) {
//         return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
//     }

//     // Find the product by ID
//     const product = await prisma.product.findUnique({
//         where: { id: parseInt(productId) },
//     });

//     if (!product) {
//         return res.status(404).json({ message: 'Product not found.' });
//     }

//     // Calculate total cost based on quantity
//     const totalCost = (parseFloat(product.cost) * quantity).toFixed(2);

//     // Create the purchase record
//     const purchase = await prisma.purchase.create({
//         data: {
//             userId: userId,
//             productId: parseInt(productId),
//             quantity: parseInt(quantity),
//             totalCost: totalCost,
//         },
//     });

//     // Send a response with purchase details
//     res.json({ message: 'Purchase successful', purchase });
// });

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

    // Check if the user is logged in
    const userId = req.session.user_id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
    }

    // Validate input
    if (!street || !city || !province || !country || !postal_code || !credit_card || !credit_expire || !credit_cvv || !cart || !invoice_amt || !invoice_tax || !invoice_total) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Start a transaction to ensure data consistency
        const purchase = await prisma.$transaction(async (prisma) => {
            // Create the Purchase record
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

            // Process cart
            const cartItems = cart.split(',').map(Number);
            const productCounts = {};
            for (const productId of cartItems) {
                productCounts[productId] = (productCounts[productId] || 0) + 1;
            }

            // Create PurchaseItem records
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

