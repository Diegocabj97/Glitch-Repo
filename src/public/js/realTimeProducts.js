const socket = io();
const form = document.getElementById("idForm");
const formDelete = document.getElementById("idFormDelete");
const botonprods = document.getElementById("showProds");
const listaProds = document.getElementById("listaProds");

// Función para mostrar los productos en la lista
function showProducts(productos) {
  listaProds.innerHTML = "";
  productos.forEach((prod) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `Nombre: ${prod.title}- Descripcion: ${prod.description} - Precio:${prod.price} - Categoría:${prod.category} - Stock: ${prod.stock} - Code: ${prod.code}`;
    listaProds.appendChild(listItem);
  });
}

formDelete.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  const deleteProd = Object.fromEntries(datForm);
  socket.emit("EliminarProd", deleteProd);
  e.target.reset();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  const prod = Object.fromEntries(datForm);
  socket.emit("nuevoProducto", prod);
  e.target.reset();
});

botonprods.addEventListener("click", () => {
  socket.emit("allProds");
});

socket.on("allProds", (productos) => {
  showProducts(productos);
});

socket.on("nuevoProducto", (productos) => {
  showProducts(productos);
});

socket.on("EliminarProd", (productos) => {
  showProducts(productos);
});
