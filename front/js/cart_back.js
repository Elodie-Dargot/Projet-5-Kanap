            /******************GESTION DES ARTICLES DU PANIER*********************/
//ajoute les produits au panier

/*export*/ function addToCart(id, quantity, color){
    let cart = getCart()
    let product = {id, quantity, color}
    if (searchForProductInCart(cart, product)){
        changeQuantity(product, quantity)
    } else {
        cart.push({id, quantity, color})
        saveCart(cart)
    }
}

//Je récupère les produits du panier
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
} 

//fonction qui prend en argument l'id du produit que l'on veut récupérer et retourne une promesse de la requête pour le produit
function getProduct(id){
    return fetch("http://localhost:3000/api/products/" + id)
        .then(function(res) {
            if (res.ok) {
                return res.json()
            }
        })
}

//Afficher panier vide
function emptyCart() {
    let title = document.querySelector("h1")
    title.innerText = "Votre panier est vide..."
}

//affiche les produits du panier
function displayCart() {
    let cart = getCart()
    let cartSection = document.getElementById("cart__items")
    if (cart.length == 0){
        emptyCart()
    } else {
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
                cartSection.innerHTML += cartProduct
            })
            .catch(function(err) {
                console.log("display cart:" + err)
              })
        }
    }
}
displayCart()


//enregistre le panier sur localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//vérifie s'il existe déjà dans le panier un produit avec le meme id et la même couleur
function searchForProductInCart(cart, product){
    return cart.some((p) => p.id === product.id && p.color === product.color)
}

//pour changer la quantité depuis la page produit
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

//calcul le nombre d'articles dans le panier et affiche le total
function getNumberProduct() {
    let cart = getCart();
    let number = 0;
    for (let product of cart) {
        number += product.quantity;
    }
    let totalProducts = document.getElementById("totalQuantity")
    totalProducts.innerText = number
}
getNumberProduct()

//calcul le prix total du panier et l'affiche
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


//Change la quantité depuis l'input de la page panier
function buttonChangeQuantityOnCartPage(){
    let allButtonQuantity = Array.from(document.getElementsByClassName("itemQuantity")) //Pour "sécuriser" le tableau car le "HTML" collection changeait
    for (let btn of allButtonQuantity) {
            let productToChange = btn.closest(".cart__item")
            let productToChangeId = productToChange.dataset.id
            let productToChangeColor = productToChange.dataset.color
        
            btn.addEventListener('change', function(){
                let cart = getCart()
                let newQuantity = Number(btn.value)
                let foundProduct = cart.find(p => p.id == productToChangeId && p.color == productToChangeColor)
                if (newQuantity <= 0 || newQuantity > 100){                   
                    btn.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327">&nbsp;La quantité doit être comprise entre 1 et 100</div>`)
                    deleteAlert()
                } else {
                    foundProduct.quantity = newQuantity
                    saveCart(cart)
                    getNumberProduct()
                    getTotalPrice()
                }
        })
    }
}
buttonChangeQuantityOnCartPage()

//Fais disparaitre le message d'alerte 
function deleteAlert(){
    let alert = document.getElementById("alert")
    setTimeout(function(){
        alert.remove()
    }, 1500)
}

//Supprime l'article au clic sur le bouton correspondant
function buttonDeleteItemOnCartPage(){
    let allButtonDelete = Array.from(document.getElementsByClassName("deleteItem"))
    let cart = getCart()
    for (let btn of allButtonDelete) {
            let productToChange = btn.closest(".cart__item")
            let productToChangeId = productToChange.dataset.id
            let productToChangeColor = productToChange.dataset.color
            btn.addEventListener('click', function(){
                let foundProduct = cart.find(p => p.id == productToChangeId && p.color == productToChangeColor)
                cart = cart.filter(p=> p != foundProduct);
                saveCart(cart);
                getNumberProduct()
                getTotalPrice()
                productToChange.remove()
        })
    }
}
//pour appeler ma fonction une fois que toute la page est chargée sinon l'affichage des totaux ne fonctionnaient pas sans recharger la page à cause des promesses
window.addEventListener('load', (event) => {
    buttonChangeQuantityOnCartPage()
    buttonDeleteItemOnCartPage()
  })

                         /******************GESTION DE LA COMMANDE*********************/



// Disparition du formulaire de commande si panier vide
function toggleForm(){
    let orderSection = document.querySelector(".cart__order")
    let cart = getCart()
    if (cart.length == 0){
        orderSection.style.visibility = "hidden"
    } else {
        orderSection.style.visibility = "visible"
    }
}
toggleForm()

//je récupère mon formulaire dans une variable
let form = document.querySelector(".cart__order__form");

// ************************* firstName validation ****************************

//j'écoute la modification du formulaire Prénom
form.firstName.addEventListener('change', function() {
    let errorMessage = document.getElementById('firstNameErrorMsg')
    if (validFirstName(this) == false){
        errorMessage.innerText = "Champ invalide"
    } else {
        errorMessage.innerText = ""
    }
});

//je crée la regex et son test pour informer l'utilisateur de la conformité du champ renseigné
const validFirstName = function(inputFirsName) {
    let firstNameRegExp = new RegExp('^[A-Za-z\é\è\ê\-]+$');
    if (firstNameRegExp.test(inputFirsName.value) == false) {
        return false
    } else {
        return true
    }
}

// ************************* lastName validation ****************************

//j'écoute la modification du formulaire Nom
form.lastName.addEventListener('change', function() {
    let errorMessage = document.getElementById('lastNameErrorMsg')
    if (validLastName(this) == false) {
        errorMessage.innerText = "Champ invalide"
    } else {
        errorMessage.innerText = ""
    }

});
//je crée la regex et son test pour informer l'utilisateur de la conformité du champ renseigné
const validLastName = function(inputLastName) {
    let lastNameRegExp = new RegExp('^[A-Za-z\é\è\ê\-]+$');
    let testLastName = lastNameRegExp.test(inputLastName.value)
    if (testLastName == false) {
        return false
    } else {
        return true
    }
}

// ************************* Adresse validation ****************************

//j'écoute la modification du formulaire Adresse
form.address.addEventListener('change', function() {
    let errorMessage = document.getElementById('addressErrorMsg')
    if (validAddress(this) == false) {
        errorMessage.innerText = "Champ invalide"
    } else {
        errorMessage.innerText = ""
    }
});
//je crée la regex et son test pour informer l'utilisateur de la conformité du champ renseigné
const validAddress = function(inputAddress) {
    let addressRegExp = /^[#.0-9a-zA-Z\s,-]+$/;
    let testAddress = addressRegExp.test(inputAddress.value)
    if (testAddress == false) {
        return false
    } else {
        return true
    }
}

// ************************* ville validation ****************************

//j'écoute la modification du formulaire Ville
form.city.addEventListener('change', function() {
    let errorMessage = document.getElementById('cityErrorMsg')
    if (validCity(this) == false) {
        errorMessage.innerText = "Champ invalide"
    } else {
        errorMessage.innerText = ""
    }
});

//je crée la regex et son test pour informer l'utilisateur de la conformité du champ renseigné
const validCity = function(inputCity) {
    let cityRegExp = new RegExp('^[A-Za-z\é\è\ê\-]+$');
    let testCity = cityRegExp.test(inputCity.value)
    if (testCity == false) {
        return false
    } else {
        return true
    }
}

// ************************* Email validation ****************************

//j'écoute la modification du formulaire Email
form.email.addEventListener('change', function() {
    let errorMessage = document.getElementById('emailErrorMsg')
    if (validEmail(this) == false) {
        errorMessage.innerText = "Champ invalide"
    } else {
        errorMessage.innerText = ""
    }
});

//je crée la regex et son test pour informer l'utilisateur de la conformité du champ renseigné
const validEmail = function(inputEmail) {
    let emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    let testEmail = emailRegExp.test(inputEmail.value)
    if (testEmail == false) {
        return false
    } else {
        return true
    }
}

// ***************Soumission du formulaire*********************


// creation de l'objet contact
class Contacts {
    constructor(firstName, lastName, address, city, email){
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address; 
        this.city = city;
        this.email = email;
    }
}
//j'écoute la soumission du formulaire et j'enregistre les données du formulaire dans le local storage
form.order.addEventListener('click', function(e) {
     e.preventDefault()
    if (validFirstName(form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email)) {
        let contact = new Contacts(form.firstName.value, form.lastName.value, form.address.value, form.city.value, form.email.value)
        localStorage.setItem("contact", JSON.stringify(contact));
        submit()
    } else{
        let orderButton = document.querySelector('.cart__order__form__submit')
        orderButton.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>Merci de renseigner tous les champs du formulaire du formulaire.</div>`)
        deleteAlert()
    }
});

//je récupère les id de tous les produits du tableau
function getCartProductIds(){
    let cart = getCart()
    let products = []
    for (let i of cart){
        products.push(i.id)
    }
    return products
}

//je récupère les données du formulaire sur le local storage
function getFormData() {
    let form = localStorage.getItem("contact");
        return JSON.parse(form);
} 

function submit(){
    let contact = getFormData()
    let products = getCartProductIds()
    console.log(products)
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({contact, products})
    })
    .then(function(res) {
        if (res.ok) {
            let test = res.json();
            console.log(test)
            return test
        } else {
            console.log("response not ok")
        }
      })
      .then(function(value){
        document.location.href ="./confirmation.html?order=" + value.orderId;
        localStorage.clear()
    })
    .catch(function(err) {
        console.log(err);
      });
}


