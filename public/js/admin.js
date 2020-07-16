function deleteProduct(btn)
{
    const prodId = btn.parentNode.querySelector('[name=productID]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');

    // Send request
    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {'csrf-token': csrf}
    })
    // Recieve response
    .then(res => {
        return res.json();
    })
    .then(message => {
        console.log(message);
        productElement.parentNode.removeChild(productElement);
    })
};
