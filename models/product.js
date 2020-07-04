// Third-party packages
const mongodb = require('mongodb');

// Imports
const getDB = require('../database').db;

class Product 
{
    constructor(title, price, description, imageURL, id)
    {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageURL = imageURL;
        this._id = id ? new mongodb.ObjectId(id) : null;
    } 

    save()
    {
        const db = getDB();
        
        // Id is undefined
        if (!this._id)
        {
            // Insert
            return db.collection('products').insertOne(this);
        }
        else
        {
            /* 
                Parameters:
                1) Filter criteria
                2) Object attributes to be updated into the database
            */
            return db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
        }
    }

    static findAll()
    {
        return getDB().collection('products').find().toArray();
    }

    static findByID(productID)
    {
        return getDB().collection('products').findOne({_id: new mongodb.ObjectId(productID)});
    }

    static deleteByID(productID)
    {
        return getDB().collection('products').deleteOne({_id: new mongodb.ObjectId(productID)});
    }
}

// Export
module.exports = Product;