//afficher le panier

function displayCart() {
    let cart = getCart()
    for (let i in cart){
        fetch("http://localhost:3000/api/products/" + cart[i].id)
        .then(function(res) {
            if (res.ok) {
                return res.json()
            }
        })
        .then(function(value){
            let cartProduct = `
            <article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                <div class="cart__item__img">
                    <img src=${value.imageUrl} alt=${value.altTxt}>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${value.name}</h2>
                        <p>${cart[i].color}</p>
                        <p>${value.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté :</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
            let cartSection = document.getElementById("cart__items")
            cartSection.innerHTML += cartProduct
        })
        .catch(function(err) {
            console.log(err)
          })
    }
}

displayCart()

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

//let ItemToDeleteFromCart = document.getElementsByClassName('cart__item')
//console.log(ItemToDeleteFromCart)
//deleteItemFromCart.addEventListener('click', removeFromCart())


/*let quantityOnCart = document.getElementsByClassName("itemQuantity")
console.log(quantityOnCart)
let changeQuantityOnCart = document.querySelector(".itemQuantity").value
console.log(changeQuantityOnCart)
quantityOnCart.addEventListener('change', updateValue())
function updateValue(event){
    changeQuantityOnCart = event.target.value
}*/

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

let totalProducts = document.getElementById("totalQuantity")
totalProducts.innerText = getNumberProduct()

function getTotalPrice() {
    let cart = getCart();
    let product = document.querySelector(".cart__item__content__description p.value")
    console.log(product)
    let total = 0;
    for (let product of cart) {
        total += product.quantity * product.price
    }
    return total;
}

let totalPrice = document.getElementById("totalPrice")
totalPrice.innerText = getTotalPrice()