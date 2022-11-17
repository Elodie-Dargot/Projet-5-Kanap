let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("order");
let test = document.getElementById('orderId')
test.innerText = id