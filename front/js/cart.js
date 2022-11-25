            /******************GESTION DES ARTICLES DU PANIER*********************/
//appel les fonction uniquement si l'on est sur la page panier sinon elles sont prises en compte lors de l'import de la fonction addToCart
addEventListener('DOMContentLoaded', (event) => {
    let str = window.location.href;
    if (str.endsWith('cart.html')) {
        displayCart();
        getNumberProduct();
        getTotalPrice();
        addEventsListeners();
    }
});
    
//ajoute les produits au panier
export function addToCart(id, quantity, color){
    let cart = getCart();
    let product = {id, quantity, color};
    if (isProductInCart(cart, product)){
        changeQuantity(product, quantity);
    } else {
        cart.push(product);
        saveCart(cart);
    }
}

//enregistre le panier sur localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

//vérifie s'il existe déjà dans le panier un produit avec le meme id et la même couleur
function isProductInCart(cart, product){
    return cart.some((p) => p.id === product.id && p.color === product.color);
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
                return res.json();
            }
        });
}

//Afficher panier vide
function displayEmptyCart() {
    let title = document.querySelector("h1");
    title.innerText = "Votre panier est vide...";
    toggleForm();
}

//affiche les produits du panier
function displayCart() {
    let cart = getCart();
    if (cart.length == 0){
        displayEmptyCart();
    } else {
        addProductElementsToCartSection(cart).then(function() {
            buttonChangeItemQuantityAddEventListeners();
            buttonDeleteItemOnCartPageAddEventListeners();
        });
    }
}

function addProductElementsToCartSection(products){
    let cartProductPromises =[];
    for (let i of products){
        cartProductPromises.push(getProduct(i.id)
        .then(function(value) {
            return {
                id: i.id,
                color: i.color,
                imageUrl: value.imageUrl,
                altTxt: value.altTxt,
                name: value.name,
                price: value.price,
                quantity: i.quantity
            }
        })
        .catch(function(err) {
            console.log(err);
        }));
    }
    return Promise.all(cartProductPromises)
    .then(function(values) {
        let cartSection = document.getElementById("cart__items");
        let cartSectionHTML = ""
        for (let value of values) {
            cartSectionHTML += `
            <article class="cart__item" data-id="${value.id}" data-color="${value.color}">
                <div class="cart__item__img">
                    <img src=${value.imageUrl} alt=${value.altTxt}>
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${value.name}</h2>
                        <p>${value.color}</p>
                        <p>${value.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté :</p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${value.quantity}>
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
        }
        cartSection.innerHTML = cartSectionHTML;
    });
}


//pour changer la quantité depuis la page produit
function changeQuantity(product, quantity) {
    let cart = getCart();
    let foundProduct = cart.find(p => p.id == product.id && p.color == product.color);
    if (foundProduct != undefined) {
        foundProduct.quantity += quantity;
       if (foundProduct.quantity <= 0){
            removeFromCart(foundProduct);
        } else {
            saveCart(cart);
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
    totalProducts.innerText = number;
}


//calcul le prix total du panier et l'affiche
function getTotalPrice() {
    let cart = getCart();
    let cartProductPromises = [];
    for (let product of cart) {
        cartProductPromises.push(getProduct(product.id)
        .then(function(value){
            return product.quantity * value.price;
        }))
    }
    Promise.all(cartProductPromises)
    .then(function(results){
        let total = results.reduce((a,b) => a + b, 0);
        let totalPrice = document.getElementById("totalPrice");
        totalPrice.innerText = total;
    })
}


//Change la quantité depuis l'input de la page panier
function buttonChangeItemQuantityAddEventListeners(){
    let allButtonQuantity = Array.from(document.getElementsByClassName("itemQuantity")); //Pour "sécuriser" le tableau car le "HTML" collection changeait
    for (let btn of allButtonQuantity) {
            let productToChange = btn.closest(".cart__item");
            let productToChangeId = productToChange.dataset.id;
            let productToChangeColor = productToChange.dataset.color;
            btn.addEventListener('change', function(){
                let cart = getCart();
                let newQuantity = Number(btn.value);
                let foundProduct = cart.find(p => p.id == productToChangeId && p.color == productToChangeColor);
                if (newQuantity <= 0 || newQuantity > 100){                   
                    btn.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327">&nbsp;La quantité doit être comprise entre 1 et 100</div>`);
                    deleteAlert();
                } else {
                    foundProduct.quantity = newQuantity;
                    saveCart(cart);
                    getNumberProduct();
                    getTotalPrice();
                }
        })
    }
}

//Fais disparaitre le message d'alerte dès qu'une quantité adéquate est renseignée
function deleteAlert(){
    let alert = document.getElementById("alert");
    setTimeout(function(){
        alert.remove();
    }, 1500);
}

//Supprime l'article au clic su le bouton correspondant
function buttonDeleteItemOnCartPageAddEventListeners(){
    let allButtonDelete = Array.from(document.getElementsByClassName("deleteItem"));
    console.log(allButtonDelete)
    for (let btn of allButtonDelete) {
            let productToChange = btn.closest(".cart__item");
            let productToChangeId = productToChange.dataset.id;
            let productToChangeColor = productToChange.dataset.color;
            btn.addEventListener('click', function(){
                let cart = getCart();
                console.log("You clicked delete button for product ${productToChangeId}");
                let foundProduct = cart.find(p => p.id == productToChangeId && p.color == productToChangeColor);
                cart = cart.filter(p=> p != foundProduct);
                saveCart(cart);
                getNumberProduct();
                getTotalPrice();
                productToChange.remove();
                displayCart();
        })
    }
}

                         /******************GESTION DE LA COMMANDE*********************/



// Disparition du formulaire de commande si panier vide
function toggleForm(){
    let orderSection = document.querySelector(".cart__order");
    let cart = getCart();
    if (cart.length == 0){
        orderSection.style.visibility = "hidden";
    } else {
        orderSection.style.visibility = "visible";
    }
}



//je récupère mon formulaire dans une variable
let form = document.querySelector(".cart__order__form");

// je créée le regex pour le type d'input et retourne le resultat de test
function validateInput(inputText, inputType = "") {
    let regex;
    switch(inputType) {
        case "address":
            regex = /(([\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]\'[\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]*)|(-[\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}|[\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}-)|([\wÀ-ÖÙ-íñ-öù-ýîÎïÏ]*\s?))*/;
            break;
        case "email":
            regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
            break;
        case "firstName":
        case "lastName":
        case "city":
        default:
            regex = new RegExp('^(([A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]\'[A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]*)|(-[A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}|[A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]{2,}-)|([A-Za-zÀ-ÖÙ-íñ-öù-ýîÎïÏ]*\s?))*$');
    }
    return regex.test(inputText);
}

//je valide le champs du formulaire et renvoi le message d'erreur si nécessaire
function getInputValidationMessage(inputText, inputType) {
    let isValid = validateInput(inputText, inputType);
    if (isValid) {
        return "";
    } else {
        return "Champ invalide";
    }
}

function addEventsListeners(){
    //j'écoute la modification du formulaire Prénom
    form.firstName.addEventListener('change', function() {
    let errorMessage = document.getElementById('firstNameErrorMsg');
    errorMessage.innerText = getInputValidationMessage(this.value, "firstName");
    })

    //j'écoute la modification du formulaire Nom
    form.lastName.addEventListener('change', function() {
        let errorMessage = document.getElementById('lastNameErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "lastName");
    });

    //j'écoute la modification du formulaire Adresse
    form.address.addEventListener('change', function() {
        let errorMessage = document.getElementById('addressErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "address");
    });


    //j'écoute la modification du formulaire Ville
    form.city.addEventListener('change', function() {
        let errorMessage = document.getElementById('cityErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "city");
    });

    //j'écoute la modification du formulaire Email
    form.email.addEventListener('change', function() {
        let errorMessage = document.getElementById('emailErrorMsg');
        errorMessage.innerText = getInputValidationMessage(this.value, "email");
    });

    //j'écoute la soumission du formulaire et j'enregistre les données du formulaire dans le local storage
    form.order.addEventListener('click', function(e) {
        e.preventDefault();
    if (validateInput(form.firstName.value) && validateInput(form.lastName.value) && validateInput(form.address.value, "address") && validateInput(form.city.value) && validateInput(form.email.value, "email")) {
        let contact = new Contacts(form.firstName.value, form.lastName.value, form.address.value, form.city.value, form.email.value);
        localStorage.setItem("contact", JSON.stringify(contact));
        submit();
    } else {
        let errorMessageField = document.querySelector(".cart__order__form__submit")
        errorMessageField.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>Merci de remplir tous les champs du formulaire</div>`);
        deleteAlert();
    }
    });
}

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


//je récupère les id de tous les produits du tableau
function getCartProductIds(){
    let cart = getCart();
    let products = [];
    for (let i of cart){
        products.push(i.id);
    }
    return products;
}

//je récupère les données du formulaire sur le local storage
function getFormData() {
    let form = localStorage.getItem("contact");
        return JSON.parse(form);
} 

//j'envoi ma requête à l'API
function submit(){
    let contact = getFormData();
    let products = getCartProductIds();
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({contact, products})
    })
    .then(function(res) {
        if (res.ok) {
            return res.json();
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


