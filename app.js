const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const port = 4000;

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MogoDB Database with Mongoose
mongoose
  .connect('mongodb://127.0.0.1:27017/Sample', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected');
  })
  .catch(err => {
    console.log(err);
  });

//   Create Mongoose Schema [Database Structure]
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

// Create Mongoose Model [MongoDB Collection]
const products = new mongoose.model('Products', productSchema);

// Create
app.post('/api/v1/product/new', async (req, res) => {
  const newProduct = await products.create(req.body);

  res.status(201).json({
    success: true,
    newProduct,
  });
});

// Read
app.get('/api/v1/products', async (req, res) => {
  const allProducts = await products.find();

  if (!allProducts) {
    console.log('Nothing Found');
    return res.status(500).json({
      success: false,
      message: 'Products Not Found',
    });
  }
  res.status(200).json({
    success: true,
    allProducts,
  });
});

// Update
app.put('/api/v1/product/:id', async (req, res) => {
  let findProduct = await products.findById(req.params.id);
  findProduct = await products.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  if (!findProduct) {
    return res.status(500).json({
      success: false,
      message: 'Product Not Found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Product Successfully Updated',
    findProduct,
  });
});

// Delete
app.delete('/api/v1/product/:id', async (req, res) => {
  let findProduct = await products.findById(req.params.id);

  if (!findProduct) {
    return res.status(500).json({
      success: false,
      message: 'Product Not Found',
    });
  }

  findProduct.remove();

  res.status(200).json({
    success: true,
    message: 'Successfully Deleted',
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Backend API</h1>');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
