const socket = io();
const botonprods = document.getElementById("showProds");
const listaProds = document.getElementById("listaProds");

botonprods.addEventListener("click", () => {
  socket.emit("allProds"); // Emitir una solicitud para obtener todos los productos
});

function showProducts(productos) {
  listaProds.innerHTML = "";
  productos.forEach((prod) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `Nombre: ${prod.title}- Descripcion: ${prod.description} - Precio:${prod.price} - Categoría:${prod.category} - Stock: ${prod.stock} - Code: ${prod.code}`;
    listaProds.appendChild(listItem);
  });
}
socket.on("allProds", (productos) => {
  showProducts(productos);
});
