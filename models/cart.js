// Core packages
const fs = require('fs');
const path = require('path');

// Initialization
const directory = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports = class Cart
{
    static addProduct(id, price)
    {
        // Fetch previous cart
        fs.readFile(directory, (err, data) => {
            // Check if cart already exists
            let cart = err ? {products: [], totalPrice: 0} : JSON.parse(data);

            // Check for similar existing product
            const index = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[index];

            // Product doesnt exists
            if (!existingProduct) 
            {
                // Create new product
                let newProduct = { id: id, qty: 1 }
                // Add the new product into cart
                cart.products = [...cart.products, newProduct]
            }
            else 
            {
                // Increment and update product quantity
                let temp = {...existingProduct};
                temp.qty++;
                cart.products[index] = temp;
            }

            // Increment total price
            cart.totalPrice += parseFloat(price);
            // Write back to JSON file
            fs.writeFile(directory, JSON.stringify(cart), err => console.log(err));
        });
    }

    static deleteProduct(id, price)
    {
        fs.readFile(directory, (err, data) => {
            // Get existing cart
            const cart = JSON.parse(data);
            
            // If product to be removed from cart exists
            const productToBeDeleted = cart.products.find(p => p.id === id);
            if (productToBeDeleted)
            {
                // Decrement total price
                cart.totalPrice -= (productToBeDeleted.qty * price);

                // Filter out products with similar id
                cart.products = cart.products.filter(p => p.id !== id);

                // Write back to JSON file
                fs.writeFile(directory, JSON.stringify(cart), err => console.log(err));
            }
        });
    }

    static allProducts(callback)
    {
        fs.readFile(directory, (err, data) => {
            // Get existing cart
            callback(JSON.parse(data));
        });
    }
}