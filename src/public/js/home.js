const socket = io();
const botonprods = document.getElementById("showProds");
const listaProds = document.getElementById("listaProds");

botonprods.addEventListener("click", () => {
  socket.emit("allProds"); // Emitir una solicitud para obtener todos los productos
});

function showProducts() {
  window.location.href = "/api/products";
}
socket.on("allProds", (productos) => {
  showProducts(productos);
});
