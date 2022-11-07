class Cart{
    constructor(){
        let cart = localStorage.getItem("cart");
        if (cart == null) {
            this.cart = [];
        } else {
            this.cart = JSON.parse(cart);
        }
    }

    save() {
        localStorage.setItem("cart", JSON.stringify(this.cart));
    }

    add(product) {
        let foundProduct = this.cart.find(p => p.id == product.id);
        if (foundProduct != undefined) {
            foundProduct.quantity++
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        saveCart();
    }

    remove(product) {
        this.cart = this.cart.filter(p=> p.id != product.id);
        saveCart();
    }

    changeQuantity(product, quantity) {
        let foundProduct = this.cart.find(p => p.id == product.id);
        if (foundProduct != undefined) {
            foundProduct.quantity += quantity;
            if (foundProduct.quantity <= 0){
                removeFromCart(foundProduct);
            } else {
                saveCart()
            }
        } 
    }

    getNumberProduct() {
        let number = 0;
        for (let product of this.cart) {
            number += product.quantity;
        }
        return number;
    }

    getTotalPrice() {
        let total = 0;
        for (let product of this.cart) {
            total += product.quantity * product.price
        }
        return total;
    }
}

var str = window.location.href
var url = new URL(str)
let id = url.searchParams.get("id")
function quantityValue(){
    let quantity = document.getElementById("quantity")
    return quantity.value;
}

function colorValue(){
    let color = document.getElementById("colors")
    return color.value;
}

let buttonAddToCart = document.getElementById("addToCart");
buttonAddToCart.addEventListener('click', function() {
    buttonAddToCart.innerHTML = "Coucou!!";
})