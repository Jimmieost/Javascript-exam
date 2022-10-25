fetch("https://api.punkapi.com/v2/beers")
  .then((response) => response.json())
  .then((data) => console.log(data));
