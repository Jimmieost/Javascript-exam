let cart = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];
let beers = []; // Array där vi lägger till alla öl

const main = document.querySelector("main");
const actions = document.querySelector(".actions");
const loadMore = document.querySelector(".load-more");
const section = document.querySelector(".container");
let currentPage = 1;

const sortButton = document.createElement("button");
sortButton.addEventListener("click", () => {
  sortByAlocoholLevel();
});
sortButton.textContent = "Sort by alcohol %";
sortButton.classList.add("black-button");
actions.append(sortButton);
getBeers(currentPage);
const pageButton = document.createElement("button");
pageButton.innerText = "Load more";
pageButton.classList.add("load-more");
pageButton.classList.add("black-button");
pageButton.addEventListener("click", () => {
  getBeers((currentPage += 1));
});
loadMore.append(pageButton);

renderCart();
const clearCartButton = document.createElement("button");
clearCartButton.innerText = "Clear cart";
clearCartButton.classList.add("clear-cart-button");
clearCartButton.addEventListener("click", clearCart);
document.querySelector(".offcanvas-body").append(clearCartButton);

const purchaseButton = document.createElement("button");
purchaseButton.innerText = "Purchase";
purchaseButton.classList.add("purchase-cart-button");
purchaseButton.addEventListener("click", purchase);
document.querySelector(".offcanvas-body").append(purchaseButton);

// Sorterar listan med öl
function sortByAlocoholLevel() {
  var sortedData = beers.sort((a, b) => parseFloat(a.abv - b.abv)); // Sorterar vår beers array baserat på ABV
  beers = sortedData; //ersätter vår nuvarande öl lista med den sorterade
  renderBeers(); // Renderar om alla öl i vyn
}

// Hämtar öl ifrån api
function getBeers(page) {
  fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=20`)
    .then((response) => response.json())
    .then((data) => {
      beers.push(...data); // När vi fått tillbala öl ifrån api:t så lägger vi till det i beers arrayn
      renderBeers(); // Renderar om alla öl i vyn
    });
}

// Renderar listan med öl
function renderBeers() {
  section.innerHTML = ""; // Tömmer alla artiklar varje gång
  for (let beer of beers) {
    // Här går vi igenom vår array av öl och renderar artiklar
    const article = document.createElement("article");
    article.classList.add("beer");

    article.innerHTML = `
      <div>
      <h2>${beer.name}</h2>
      <h3>${beer.abv} %</h3>
      <h4>First brewed: ${beer.first_brewed}</h4>
      <p>${beer.tagline}</p>
      <img src=${beer.image_url} alt="Beers">
      <p>${beer.description}</p>
      <p class="price">${Math.floor(beer.abv * 5.2)}:-</p>

      </div>
      `;
    const button = document.createElement("button");
    button.classList.add("bx", "bx-cart-add");
    button.setAttribute("id", `${beer.name}`);
    button.addEventListener("click", function () {
      addToCart(beer.id);
    });
    article.append(button);

    section.append(article);
  }
}

// Lägger till vald öl i varukorg
function addToCart(beerId) {
  let beer = beers.find((beer) => beer.id === beerId);
  let beerInCart = cart.find((beer) => beer.id === beerId);
  if (beerInCart) {
    beerInCart.quantity += 1;
    beerInCart.price += Math.floor(beer.abv * 5.2);
  } else {
    beer.quantity = 1;
    beer.price = Math.floor(beer.abv * 5.2);
    cart.push(beer);
  }
  updateCartInStorage();
  renderCart();
}

// Tar bort öl ifrån varukorg
function removeFromCart(beerId) {
  const beerWithIdIndex = cart.findIndex((beer) => beer.id === beerId);
  cart.splice(beerWithIdIndex, 1);
  updateCartInStorage();
  renderCart();
}

// Renderar varukorg
function renderCart() {
  const cartList = document.querySelector(".cart-list");
  cartList.textContent = "";
  cartList.addEventListener("load", function () {
    console.log("cartList has been loaded");
  });
  const cartItemHeadingRow = document.createElement("div");
  cartItemHeadingRow.classList.add("row");
  const cartItemHeadingName = document.createElement("div");
  cartItemHeadingName.classList.add("col-6");
  cartItemHeadingName.textContent = "Name";
  const cartItemHeadingQuantity = document.createElement("div");
  cartItemHeadingQuantity.classList.add("col-2");
  cartItemHeadingQuantity.textContent = "Qty";
  const cartItemHeadingPrice = document.createElement("div");
  cartItemHeadingPrice.classList.add("col-2");
  cartItemHeadingPrice.textContent = "Price";
  cartItemHeadingRow.appendChild(cartItemHeadingName);
  cartItemHeadingRow.appendChild(cartItemHeadingQuantity);
  cartItemHeadingRow.appendChild(cartItemHeadingPrice);
  cartList.appendChild(cartItemHeadingRow);

  let totalPriceValue = 0;
  console.log(cart);
  for (let beer of cart) {
    var cartItem = renderCartItem(beer);
    cartList.appendChild(cartItem);
    totalPriceValue += beer.price;
  }

  const line = document.createElement("hr");
  cartList.appendChild(line);

  const totalRow = document.createElement("div");
  totalRow.classList.add("row");
  totalRow.classList.add("mb-2");

  const totalText = document.createElement("div");
  totalText.classList.add("col-8");
  totalText.textContent = "Total";

  const totalPrice = document.createElement("div");
  totalPrice.classList.add("col-2");
  totalPrice.textContent = `${totalPriceValue}:-`;

  totalRow.appendChild(totalText);
  totalRow.appendChild(totalPrice);
  cartList.appendChild(totalRow);
}

// Renderar en öl i varukorgen
function renderCartItem(beer) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("row");

  const cartItemName = document.createElement("div");
  cartItemName.classList.add("col-6");
  cartItemName.textContent = `${beer.name}`;

  const cartItemQuantity = document.createElement("div");
  cartItemQuantity.classList.add("col-2");
  cartItemQuantity.textContent = `${beer.quantity}`;

  const cartItemPrice = document.createElement("div");
  cartItemPrice.classList.add("col-2");
  cartItemPrice.textContent = `${beer.price}:-`;

  const cartItemButtonContainer = document.createElement("div");
  cartItemButtonContainer.classList.add("col-2");

  const removeButton = document.createElement("button");
  removeButton.classList.add("cart-button");
  removeButton.innerText = "X";
  removeButton.addEventListener("click", function () {
    removeFromCart(beer.id);
  });

  cartItemButtonContainer.appendChild(removeButton);
  cartItem.appendChild(cartItemName);
  cartItem.appendChild(cartItemQuantity);
  cartItem.appendChild(cartItemPrice);
  cartItem.appendChild(cartItemButtonContainer);
  return cartItem;
}

// Fake anrop till json placeholder när man genomför ett köp
function purchase() {
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: "purchase beer",
      body: cart,
      userId: 1,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => {
    if (response.status === 201) {
      alert("Your order has been placed!");
      clearCart();
      renderCart();
    } else {
      alert("Error placing your order!");
    }
  });
}

// Rensar hela varukorgen
function clearCart() {
  cart.length = 0;
  const cartList = document.querySelector(".cart-list");
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  localStorage.clear();
  renderCart();
}

// Updaterar varukorg
function updateCartInStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
