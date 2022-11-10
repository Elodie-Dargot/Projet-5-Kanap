function addToCart(id, quantity, color){
    let cart = getCart()
    let product = {id, quantity, color}
    if (searchForProductInCart(cart, product)){
        changeQuantity(product, quantity)
    } else {
        cart.push({id, quantity, color})
        saveCart(cart)
    }
    
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

function searchForProductInCart(cart, product){
    return cart.some((p) => p.id === product.id && p.color === product.color)
}

function changeQuantity(product, quantity) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id && p.color == product.color);

    if (foundProduct != undefined) {
        foundProduct.quantity += quantity

       if (foundProduct.quantity <= 0){
            removeFromCart(foundProduct);

        } else {
            saveCart(cart)
        }   
    } 
}
/*
function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter(p=> p.id != product.id);
    saveCart(cart);
}

function getNumberProduct() {
    let cart = getCart();
    let number = 0;
    for (let product of cart) {
        number += product.quantity;
    }
    return number;
}

function getTotalPrice() {
    let cart = getCart();
    let total = 0;
    for (let product of cart) {
        total += product.quantity * product.price
    }
    return total;
}*/