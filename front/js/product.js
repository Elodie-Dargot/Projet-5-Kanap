//je récupère l'id de la page pour créer une nouvelle URL pour la requete API correspondant au produit visé
let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");
let base = "http://localhost:3000/api/products/";
let newUrl = base + id;
// je fais ma requête à l'API pour récupérer les détails du produit
function recoverProduct(){
    fetch(newUrl)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(product){
            insertElements(product);
        })
        .catch(function(err) {
            console.log(err);
          })
    }
recoverProduct();

//j'intègre les éléments recueillies dans ma page
function insertElements(product){
    insertProductImage(product.imageUrl, product.altTxt);
    insertProduct("title", product.name);
    insertProduct("price", product.price);
    insertProduct("description", product.description);
    insertProductColorChoices(product.colors);
}

function insertProductImage(imageUrl, altTxt) {
    let img = document.querySelector(".item__img");
    img.innerHTML = `<img src=${imageUrl} alt=${altTxt}/>`;
}

function insertProduct(fieldId, textContent) {
    let field = document.getElementById(fieldId);
    field.textContent = textContent;
}

function insertProductColorChoices(colors) {
    let colorChoice = document.getElementById("colors");
    for (let i = 0; i < colors.length; i++) {
        colorChoice.innerHTML += `<option value="${colors[i]}">${colors[i]}</option>`;
    }
}

//je récupère les valeurs couleurs et quantité
function quantityValue(){
   return Number(document.getElementById("quantity").value);
}

function colorValue(){
    return document.getElementById('colors').value;
}


function createAlertMessage(messageAlert){
    alertZone.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>${messageAlert}</div>`);
    deleteAlert();
}

function deleteAlert(){
    let alert = document.getElementById("alert");
    setTimeout(function(){
        alert.remove();
    }, 1500);
}

//j'enregistre les valeur dans le panier au clic
let buttonAddToCart = document.getElementById("addToCart");
let alertZone = document.querySelector('.item__content__addButton');
buttonAddToCart.addEventListener('click', function() {
    if (quantityValue() == 0 && colorValue() == ""){
        let messageAlert = "Vous devez choisir une quantité et une couleur";
        createAlertMessage(messageAlert);
    } else if (quantityValue() == 0) {
        let messageAlert = "Vous devez choisir une quantité";
        createAlertMessage(messageAlert);
    }
    else if (colorValue() == ""){
        let messageAlert = "Vous devez choisir une couleur";
        createAlertMessage(messageAlert);
    } else if (quantityValue() <= 0 || quantityValue() > 100) {
        let messageAlert = "La quantité doit être comprise entre 1 et 100";
        createAlertMessage(messageAlert);
    } else {
        import('./cart.js').then(function(module){//les instruction import/export seules ne fonctionnaient pas sans modifier l'HTML
            module.addToCart(id, quantityValue(), colorValue());
        })
    }
})








