//////////////////GET/////////////////////////////////

fetch("https://jsonplaceholder.typicode.com/posts/")
  .then((response) => response.json())
  .then((json) => console.log(json));

////////////////POST///////////////////////////

fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  body: JSON.stringify({
    title: "foo",
    body: "bar",
    userId: 1,
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

/////////////////PUT/////////////////////////

fetch("https://jsonplaceholder.typicode.com/posts/1", {
  method: "PUT",
  body: JSON.stringify({
    id: 1,
    title: "foo",
    body: "bar",
    userId: 1,
  }),
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
})
  .then((response) => response.json())
  .then((json) => console.log(json));

/////////////////////DELETE////////////////////////

fetch("https://jsonplaceholder.typicode.com/posts/1", {
  method: "DELETE",
});
