// Third-party packages
const mongoose = require('mongoose');

// Initilization
const Schema = mongoose.Schema;

// Define the collection structure
const orderSchema = new Schema({
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    products: [{
        productData: {
            type: Object,
            required: true 
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

// Export
module.exports = mongoose.model('Order', orderSchema);