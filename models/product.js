// imports
const db = require('../database');

// Imports
const Cart = require('./cart')

// Product class
module.exports = class Product
{
  constructor(title, imageURL, description, price) 
  {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() 
  {
    return db.execute('INSERT INTO products (title, price, imageURL, description) VALUES (?, ?, ?, ?)',
    [this.title, this.price, this.imageURL, this.description]);
  }

  static findAll()
  {
    return db.execute('SELECT * FROM products');
  }

  static findByID(id)
  {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

  static deleteByID(id)
  {
  }
};
