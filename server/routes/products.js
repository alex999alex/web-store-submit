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
    

    if(isNaN(id)) {
        res.status(400).send('Invalid number.');
        return;
    }

    const product = await prisma.product.findUnique({
        where: {
            id: parseInt(id),
        },
    });

    if(product) {
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
    const { productId, quantity } = req.body;


    if (!productId || !quantity || isNaN(quantity)) {
        return res.status(400).json({ message: 'All fields (productId, quantity) are required.' });
    }


    const userId = req.session.user_id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
    }


    const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
    });

    if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
    }


    const totalCost = (parseFloat(product.cost) * quantity).toFixed(2);


    const purchase = await prisma.purchase.create({
        data: {
            userId: userId,
            productId: parseInt(productId),
            quantity: parseInt(quantity),
            totalCost: totalCost,
        },
    });


    res.json({ message: 'Purchase successful', purchase });
});




export default router;

//1

