// Core packages
const fs = require('fs');
const path = require('path');

// Imports
const Cart = require('./cart')

// Initialization
const directory = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

// Helper function
function getProductsFromFile(callback)
{
  fs.readFile(directory, (err, data) => {
    err ? callback([]) : callback(JSON.parse(data));
  });
}

// Product class
module.exports = class Product
{
  constructor(id, title, imageURL, description, price) 
  {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() 
  {
    getProductsFromFile(products => {
      // Product has an existing id
      if (this.id) 
      {
        // Update with the new product
        const index = products.findIndex(p => p.id === this.id);
        products[index] = this;
      }
      else
      {
        this.id = Math.random().toString();
        products.push(this);
      }
      
      // Write back to JSON file
      fs.writeFile(directory, JSON.stringify(products), err => console.log(err));
    });
  }

  static findAll(callback)
  {
    getProductsFromFile(callback);
  }

  static findByID(id, callback)
  {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      callback(product);
    });
  }

  static deleteByID(id)
  {
    getProductsFromFile(products => {
      // Filter out products with similar id
      const filteredProducts = products.filter(p => p.id !== id);
      // Write back to JSON file
      fs.writeFile(directory, JSON.stringify(filteredProducts), err => console.log(err));
      // Delete product from cart as well since product no longer exists
      const product = products.find(p => p.id === id);
      Cart.deleteProduct(id, product.price);
    });
  }
};
