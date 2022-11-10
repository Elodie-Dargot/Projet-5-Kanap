// je récupère les données de l'API
function recoverProducts() {
  fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function(value) {
    extractProducts(value)
  })
  .catch(function(err) {
  });
}

//Je crée les cartes de chaque produit et les insèrent sur la page d'accueil 
function extractProducts(products) {
  for (let i in products){
    let cardsProducts = `
    <a href="./product.html?id=${products[i]._id}">
      <article>
        <img src="${products[i].imageUrl}" alt=${products[i].altTxt}/>
        <h3 class="productName">${products[i].name}</h3>
        <p class="productDescription">${products[i].description}</p>
      </article>
    </a>`;
  let productsSection = document.getElementById("items")
  productsSection.innerHTML += cardsProducts
  }
}
recoverProducts()
