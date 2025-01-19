// Importing necessary dependencies
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import path from 'path';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// Instantiating the express app
const app = express();
// Accessing environment variables
dotenv.config();
// Setting port from environment variables or default 3000
const PORT = process.env.PORT || 3000;

// Applying CORS middleware to allow requests from different origins
app.use(cors());
// Applying middleware for JSON body parsing
app.use(express.json());

// Setting up to serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'client')));

// Connecting to MongoDB
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Handling connection events
mongoose.connection.on('connected', () => {
 console.log('Mongoose connection is open');
});

mongoose.connection.on('error', (err) => {
 console.log(`Mongoose connection error has occurred: ${err}`);
});

mongoose.connection.on('disconnected', () => {
 console.log('Mongoose connection is disconnected');
});

// Gracefully handling application termination by closing MongoDB connection (Thanks chatGPT)
process.on('SIGINT', () => {
 mongoose.connection.close(() => {
   console.log('Mongoose connection is disconnected due to application termination');
   process.exit(0);
 });
});

// Endpoint to seed the database with products from the given API
app.get('/seed', async (req, res) => {
 try {
   const response = await axios.get('https://fakestoreapi.com/products');
   const products = response.data;

   // Deleting all products before seeding
   await Product.deleteMany({});
   // Creating products
   await Product.create(products);

   res.json({ message: 'Database seeded successfully' });
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Endpoint to fetch all products
app.get('/products', async (req, res) => {
 try {
   const products = await Product.find({});
   res.json(products);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Endpoint to fetch a specific product by ID
app.get('/products/:id', async (req, res) => {
 const productId = req.params.id;

 try {
   const product = await Product.findOne({ id: productId });
   if (!product) {
     return res.status(404).json({ error: 'Product not found' });
   }

   res.json(product);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Endpoint to fetch products by category
app.get('/products/category/:category', async (req, res) => {
 const category = req.params.category;

 try {
   const products = await Product.find({ category });
   res.json(products);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Endpoint to add a product to the database
app.post('/products', async (req, res) => {
  try {
      const { id, title, price, description, category, image } = req.body;

      const product = await Product.create({ id, title, price, description, category, image });

      res.status(201).json(product);
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to delete a product from the database
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
      const product = await Product.findOneAndDelete({ id: productId });
      if (!product) {
          return res.status(404).json({ error: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to update/edit a product in the database
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { title, price } = req.body;

  try {
      const product = await Product.findOneAndUpdate(
          { id: productId },
          { title, price },
          { new: true }
      );
      if (!product) {
          return res.status(404).json({ error: 'Product not found' });
      }

      res.json(product);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Endpoint to add a product to the cart
app.post('/cart', async (req, res) => {
 const { productId, quantity } = req.body;

 try {
   const product = await Product.findOne({ id: productId });
   if (!product) {
     return res.status(404).json({ error: 'Product not found' });
   }

   // Creating a new cart item
   const cartItem = await Cart.create({ product: product.id, quantity });
   res.json(cartItem);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Endpoint to fetch all cart items
app.get('/cart', async (req, res) => {
 try {
   // Populating product field to include all product information
   const cartItems = await Cart.find({}).populate('product');
   res.json(cartItems);
 } catch (error) {
   console.error(error);
   res.status(500).json({ error: 'Internal Server Error' });
 }
});




// Starting the server
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});
