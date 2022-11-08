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
actions.append(sortButton);
getBeers(currentPage);
const pageButton = document.createElement("button");
pageButton.innerText = "Load more";
pageButton.classList.add("load-more");
pageButton.addEventListener("click", () => {
  getBeers((currentPage += 1));
});
loadMore.append(pageButton);

function sortByAlocoholLevel() {
  var sortedData = beers.sort((a, b) => parseFloat(a.abv - b.abv)); // Sorterar vår beers array baserat på ABV
  beers = sortedData; //ersätter vår nuvarande öl lista med den sorterade
  renderBeers(); // Renderar om alla öl i vyn
}

function getBeers(page) {
  fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=20`)
    .then((response) => response.json())
    .then((data) => {
      beers.push(...data); // När vi fått tillbala öl ifrån api:t så lägger vi till det i beers arrayn
      renderBeers(); // Renderar om alla öl i vyn
    });
}

function renderBeers() {
  section.innerHTML = ""; // Tömmer alla artiklar varje gång
  for (let beer of beers) {
    // Här går vi igenom vår array av öl och renderar artiklar
    const article = document.createElement("article");
    article.classList.add("beer");

    article.innerHTML = `
      <div>
      <h2>${beer.name}</h2>
      <p>Alcohol content: ${beer.abv} %</p>
      <p>First brewed: ${beer.first_brewed}</p>
      <p>${beer.tagline}</p>
      <img src=${beer.image_url} alt="Beers">
      
      <p class="price">${Math.floor(beer.abv * 5.2)}:-</p>

      </div>
      `;
    const button = document.createElement("button");
    button.classList.add("bx", "bx-cart-add");
    button.setAttribute("id", `${beer.name}`);
    //button.innerText = "Add to cart";
    button.addEventListener("click", addToCart);
    article.append(button);

    section.append(article);
  }
}

function addToCart(addToCart) {
  let beer = addToCart.srcElement.id;
  cart.push(beer);
  const cartList = document.createElement("li");
  cartList.innerHTML = `<p> ${cart[cart.length - 1]}</p>`;
  document.querySelector(".cart-list").append(cartList);

  store();
}

function loadCart() {
  console.log(cart);
  for (let beer of cart) {
    const cartList = document.createElement("li");
    cartList.innerHTML = `<p> ${beer}</p>`;
    document.querySelector(".cart-list").append(cartList);
  }
}
loadCart();

const button = document.createElement("button");
button.innerText = "Clear cart";
button.addEventListener("click", clearCart);
document.querySelector(".offcanvas-body").append(button);

function clearCart() {
  cart.length = 0;
  const cartList = document.querySelector(".cart-list");
  while (cartList.firstChild) {
    cartList.removeChild(cartList.firstChild);
  }
  localStorage.clear();
}
function store() {
  localStorage.setItem("cart", JSON.stringify(cart));
}
