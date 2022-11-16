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
        .then(function(value){
            insertElements(value);
        })
        .catch(function(err) {
            console.log(err);
          });
    }

recoverProduct();
//j'intègre les éléments recueillies dans ma page

function insertElements(products){
    let img = document.querySelector(".item__img");
    img.innerHTML = `<img src=${products.imageUrl} alt=${products.altTxt}/>`;
    
    let name = document.getElementById("title");
    name.textContent = products.name;

    let price = document.getElementById("price");
    price.textContent = products.price;

    let description = document.getElementById("description");
    description.textContent = products.description;

    let colorChoice = document.getElementById("colors")
    for (let i = 0; i < products.colors.length; i++) {
        colorChoice.innerHTML += `<option value="${products.colors[i]}">${products.colors[i]}</option>`
    }
}

//je récupère les valeurs couleurs et quantité
function quantityValue(){
   return Number(document.getElementById("quantity").value)
};

function colorValue(){
    return document.getElementById('colors').value
};

//j'enregistre les valeur dans le panier au clic
let buttonAddToCart = document.getElementById("addToCart");
let alertZone = document.querySelector('.item__content__addButton')
buttonAddToCart.addEventListener('click', function() {
    if (quantityValue() == 0 && colorValue() == ""){
        alertZone.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>Vous devez choisir une quantité et une couleur</div>`)
        deleteAlert()
    } else if (quantityValue() == 0) {
        alertZone.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>Vous devez choisir une quantité</div>`)
        deleteAlert()
    }
    else if (colorValue() == ""){
        alertZone.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>Vous devez choisir une couleur</div>`)
        deleteAlert()
    } else if (quantityValue() <= 0 || quantityValue() > 100) {
        alertZone.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold; color: #af3327"><br>La quantité doit être comprise entre 1 et 100</div>`)
        deleteAlert()
    }
    else {
        addToCart(id, quantityValue(), colorValue())
        alertZone.insertAdjacentHTML('afterend', `<div id = "alert" style= "text-align: center; font-weight: bold"><br>Produit ajouté au panier</div>`)
        deleteAlert()
    }
})

function deleteAlert(){
    let alert = document.getElementById("alert")
    setTimeout(function(){
        alert.remove()
    }, 1500)
}






