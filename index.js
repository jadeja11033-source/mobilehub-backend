// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer'); 
// const path = require('path');   

// // Models Import
// const Product = require('./models/product'); 
// const User = require('./models/User');

// dotenv.config();
// const app = express();

// // --- MIDDLEWARES ---
// app.use(cors());
// app.use(express.json());

// // Static Folder: Taaki photos browser mein dikhein
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // --- DATABASE CONNECTION ---
// mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/MobileHub')
// .then(() => console.log('✅ LOCAL POWER: Connected to MongoDB!'))
// .catch((err) => console.log('❌ DB Connection Error:', err));

// // --- MULTER CONFIGURATION ---
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); 
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

// // --- AUTH ROUTES ---

// app.post('/register', async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: "Email already exists!" });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ name, email, password: hashedPassword, role });
//         await newUser.save();
//         res.status(201).json({ message: "Account created successfully!" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// app.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "User not found!" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

//         const token = jwt.sign(
//             { id: user._id, role: user.role }, 
//             process.env.JWT_SECRET || 'secretkey', 
//             { expiresIn: '1d' }
//         );

//         res.json({ 
//             token, 
//             user: { id: user._id, name: user.name, role: user.role } 
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // --- PRODUCT ROUTES ---

// // 1. Add Product (Hybrid: File Upload ya URL Link)
// app.post('/add-product', upload.single('image'), async (req, res) => {
//     try {
//         // req.body se imageUrl bhi nikaalo
//         const { name, price, description, stock, imageUrl } = req.body;
        
//         let finalImage = "";

//         // Condition 1: Agar file upload ki hai (Priority)
//         if (req.file) {
//             finalImage = `http://localhost:5000/uploads/${req.file.filename}`;
//         } 
//         // Condition 2: Agar file nahi hai par URL link diya hai
//         else if (imageUrl) {
//             finalImage = imageUrl;
//         }

//         const newProduct = new Product({
//             name,
//             price,
//             description,
//             stock,
//             image: finalImage 
//         });

//         await newProduct.save();
//         res.status(201).json({ message: "Product added!", data: newProduct });
//     } catch (err) {
//         console.error("Upload Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// });

// // 2. Get All Products
// app.get('/products', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // 3. Delete Product
// app.delete('/product/:id', async (req, res) => {
//     try {
//         await Product.findByIdAndDelete(req.params.id);
//         res.json({ message: "Product deleted successfully!" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // --- SERVER START ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); 
const path = require('path');   

// Models Import
const Product = require('./models/Product'); 
const User = require('./models/User');

dotenv.config();
const app = express();

// --- MIDDLEWARES ---
// CHANGE 1: CORS ko open rakho taaki Netlify connect ho sake
app.use(cors()); 
app.use(express.json());

// Static Folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DATABASE CONNECTION ---
// CHANGE 2: Console message badal diya taaki confirm ho ki ye Atlas hai
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ DATABASE POWER: Connected to MongoDB Atlas!'))
.catch((err) => console.log('❌ DB Connection Error:', err));

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- AUTH ROUTES ---
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already exists!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secretkey', 
            { expiresIn: '1d' }
        );

        res.json({ 
            token, 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PRODUCT ROUTES ---

app.post('/add-product', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, stock, imageUrl } = req.body;
        let finalImage = "";

        if (req.file) {
            // CHANGE 3: http://localhost:5000 hata diya, sirf path rakha
            finalImage = `/uploads/${req.file.filename}`;
        } 
        else if (imageUrl) {
            finalImage = imageUrl;
        }

        const newProduct = new Product({
            name, price, description, stock,
            image: finalImage 
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added!", data: newProduct });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
