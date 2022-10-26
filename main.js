//meny
let items = [
  { text: "Menu 1", path: "" },
  { text: "Menu 2", path: "" },
  { text: "Menu 3", path: "" },
];
let cart = [];

const main = document.querySelector("main");
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

function getBeers(page) {
  fetch(`https://api.punkapi.com/v2/beers?page=${page}&per_page=10`)
    .then((response) => response.json())
    .then((data) => updateHTML(data));
}

getBeers(currentPage);

function updateHTML(data) {
  for (let item of data) {
    const article = document.createElement("article");
    article.classList.add("beer");

    // console.log(item);
    article.innerHTML = `
    <div>
    <h2>${item.name}</h2>
    <p>${item.tagline}</p>
    <img src=${item.image_url} alt="Beers">
    <p>${item.description}</p>
    </div>
    `;
    const button = document.createElement("button");
    button.innerText = "Add to cart";
    button.addEventListener("click", () => addToCart(item));
    article.append(button);

    section.append(article);
  }
  const pageButton = document.createElement("button");
  pageButton.innerText = "Load more";
  pageButton.classList.add("load-more");
  pageButton.addEventListener("click", () => {
    getBeers((currentPage += 1));
    main.removeChild(pageButton);
  });
  main.append(pageButton);
}
function addToCart(item) {
  cart.push(item);
  console.log(cart);
}
