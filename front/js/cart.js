//Je récupère les produits du panier
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
} 
//fonction qui prend en argument l'id du produit que l'on veut récupérer et retourne une promesse
function getProduct(id){
    return fetch("http://localhost:3000/api/products/" + id)
        .then(function(res) {
            if (res.ok) {
                return res.json()
            }
        })
}

//affiche les produits du panier
function displayCart() {
    let cart = getCart()
    for (let i of cart){
        getProduct(i.id)
        .then(function(value){
            let cartProduct = `
            <article class="cart__item" data-id="${i.id}" data-color="${i.color}">
                <div class="cart__item__img">
                    <img src=${value.imageUrl} alt=${value.altTxt}>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${value.name}</h2>
                        <p>${i.color}</p>
                        <p>${value.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté :</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${i.quantity}>
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
            console.log("display cart:" + err)
          })
    }
}
displayCart()

//ajoute les produits au panier
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

//enregistre le panier sur localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//vérifie s'il existe déjà dans le panier un produit avec le meme id et la même couleur
function searchForProductInCart(cart, product){
    return cart.some((p) => p.id === product.id && p.color === product.color)
}

//pour changer la quantité 
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

//supprime du panier
function removeFromCart(product) {
    let cart = getCart();
    cart = cart.filter(p=> p.id != product.id);
    saveCart(cart);
}

//calcul le nombre d'articles dans le panier
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

//calcul le prix total
function getTotalPrice() {
    let cart = getCart()
    let cartProductPromises = []
    for (let product of cart) {
        cartProductPromises.push(getProduct(product.id)
        .then(function(value){
            return product.quantity * value.price
        }))
    }
    Promise.all(cartProductPromises)
    .then(function(results){
        let total = results.reduce((a,b) => a + b, 0)
        let totalPrice = document.getElementById("totalPrice")
        totalPrice.innerText = total
    })
}
getTotalPrice()

/*function buttonChangeQuantityOnCartPage(){
    let allButtonQuantity = [document.getElementsByClassName("itemQuantity")]
    for (let btn in allButtonQuantity) {
        console.log(btn.value)
    }
}
    
buttonChangeQuantityOnCartPage()*/