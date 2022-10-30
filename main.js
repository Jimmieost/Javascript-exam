//meny
let items = [
  { text: "Menu 1", path: "" },
  { text: "Menu 2", path: "" },
  { text: "Menu 3", path: "" },
];
let cart = [];
let beers = []; // Array där vi lägger till alla öl

const main = document.querySelector("main");
const actions = document.querySelector(".actions");
const loadMore = document.querySelector(".load-more");
const section = document.querySelector(".container");
const nav = document.querySelector("nav");
let currentPage = 1;

items.forEach(function (item) {
  0;
  let link = document.createElement("a");
  link.classList.add("menu-item");
  link.href = item.path;
  link.textContent = item.text;

  nav.appendChild(link);
});
const sortButton = document.createElement("button");
sortButton.addEventListener("click", () => {
  sortByAlocoholLevel();
});
sortButton.textContent = "Sort";
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
  fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=10`)
    .then((response) => response.json())
    .then((data) => {
      beers.push(...data); // När vi fått tillbala öl ifrån api:t så lägger vi till det i beers arrayn
      renderBeers(); // Renderar om alla öl i vyn
    });
}

function addToCart(item) {
  cart.push(item);
  console.log(cart);
}

function renderBeers() {
  section.innerHTML = ""; // Tömmer alla artiklar varje gång
  for (let beer of beers) {
    // Här går vi igenom vår array av öl och renderar artiklar
    const article = document.createElement("article");
    article.classList.add("beer");

    console.log(beer);
    article.innerHTML = `
      <div>
      <h2>${beer.name}</h2>
      <h3>${beer.abv} %</h3>
      <p>${beer.tagline}</p>
      <img src=${beer.image_url} alt="Beers">
      <p>${beer.description}</p>
      </div>
      `;
    const button = document.createElement("button");
    button.innerText = "Add to cart";
    button.addEventListener("click", () => addToCart(beer));
    article.append(button);
    console.log(button);

    section.append(article);
  }
}
