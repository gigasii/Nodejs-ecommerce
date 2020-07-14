// Third-party packages
const mongoose = require('mongoose');

// Initilization
const Schema = mongoose.Schema;

// Define the collection structure
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
    cart: {
        products: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }, 
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

// Custom functions
userSchema.methods.addToCart = function(product)
{
    // Check if product already exists
    const index = this.cart.products.findIndex(p => {
        return p.productId.toString() == product._id.toString();
    });

    if (index != -1)
    {
        let newQuantity = ++this.cart.products[index].quantity;
        this.cart.products[index].quantity = newQuantity;
        //console.log('Existing product');
    }
    else
    {
        this.cart.products.push({productId: product._id, quantity: 1});
        //console.log('New product');
    }

    // Update this user document
    return this.save();
}

userSchema.methods.deleteFromCart = function(productId)
{
    // Filter out the that specific product
    const updatedCart = this.cart.products.filter(p => {
        return p.productId.toString() != productId.toString();
    })
    // Update the cart to contain olnly the rest of the products
    this.cart.products = updatedCart;

   // Update this user document
    return this.save();
}

userSchema.methods.clearCart = function()
{
    this.cart = {products: []};
    return this.save();
}

// Export
module.exports = mongoose.model('User', userSchema);