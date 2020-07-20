//let host = "http://localhost:3000/";
let host = "https://nodeshop-giggs.herokuapp.com/";

function deleteProduct(btn)
{
    let prodId = btn.parentNode.querySelector('[name=productID]').value;
    let csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');

    // Define a URL to send a http request
    fetch(host + "admin/delete-product/" + prodId, {
        method: 'DELETE',
        headers: {
            'CSRF-Token': csrf
        },
    })
    // Recieve response
    .then(res => {
        return res.json();
    })
    .then(resData => {
        console.log(resData.message);
        productElement.parentNode.removeChild(productElement);
    });
};

function deleteCartProduct(btn)
{
    let prodId = btn.parentNode.querySelector('[name=productID]').value;
    let csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('li');

    // Define a URL to send a http request
    fetch(host + "delete-cart-product", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrf
        },
        body: JSON.stringify({
            productID: prodId
        })
    })
    // Recieve response
    .then(res => {
        return res.json();
    })
    .then(resData => {
        console.log(resData.message);
        productElement.remove();
    });
}
