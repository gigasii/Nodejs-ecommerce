// Third-party packages
const mongodb = require('mongodb');

// Imports
const getDB = require('../database').db;

class User
{
    constructor(id, name, email, cart)
    {
        this._id = id;
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : {products: []};
    }

    save()
    {
        return getDB().collection('users').insertOne(this);
    }

    static findByID(userID)
    {
        return getDB().collection('users').findOne({_id: new mongodb.ObjectId(userID)});
    }

    addToCart(product)
    {
        // Check if product already exists
        const index = this.cart.products.findIndex(p => {
            return p.productID.toString() === product._id.toString();
        });

        // Product exists
        if (index != -1)
        {
            let newQuantity = ++this.cart.products[index].quantity;
            this.cart.products[index].quantity = newQuantity;
            console.log('Existing product');
        }     
        // New product
        else
        {
            this.cart.products.push({productID: new mongodb.ObjectId(product._id), quantity: 1});
            console.log('New product');
        }

        return getDB().collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: this.cart}});
    }

    deleteFromCart(productID)
    {
        const updatedCart = this.cart.products.filter(p => {
            return p.productID.toString() != productID.toString();
        })
        this.cart.products = updatedCart;

        return getDB().collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: this.cart}});
    }

    getCart()
    {
        const productIDs = this.cart.products.map(p => { return p.productID; });
        
        // Initially find products which matches one of the ids
        return getDB().collection('products').find({_id: {$in: productIDs}}).toArray()
        .then(products => {
            return products.map(p => {
                // Embed each product with their quantity field
                return {...p, quantity: this.cart.products.find(i => { return i.productID.toString() === p._id.toString(); }).quantity}
            })
        })
    }

    addOrder()
    {
        return this.getCart()
        .then(products => {
            // Create new order object
            const order = {
                products: products,
                user: {
                    _id: new mongodb.ObjectId(this._id),
                    name: this.name
                }
            }
             // Add order to database
            return getDB().collection('orders').insertOne(order)
        })
        .then(() => {
            // Clear cart in database
            this.cart = {products: []};
            return getDB().collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: this.cart}});
        });
    }

    getOrders()
    {
        return getDB().collection('orders').find({'user._id': new mongodb.ObjectId(this._id)}).toArray();
    }
}

// Export
module.exports = User;