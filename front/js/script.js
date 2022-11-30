// je récupère les données de l'API
function recoverProducts() {
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    displayProducts(value);
  })
  .catch(function() {
    alert("Une erreur est survenue, le serveur ne semble pas accessible");
  })
}
recoverProducts();

//Je crée les cartes de chaque produit et les insèrent sur la page d'accueil 
function displayProducts(products) {
  for (let i in products){
    let cardsProducts = `
    <a href="./product.html?id=${products[i]._id}">
      <article>
        <img src="${products[i].imageUrl}" alt=${products[i].altTxt}/>
        <h3 class="productName">${products[i].name}</h3>
        <p class="productDescription">${products[i].description}</p>
      </article>
    </a>`;
  let productsSection = document.getElementById("items");
  productsSection.innerHTML += cardsProducts;
  }
}

