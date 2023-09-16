const socket = io();
let email;

Swal.fire({
  title: "Identificacion de usuario",
  text: "Por favor ingrese su email",
  input: "text",
  inputValidator: (valor) => {
    return !valor && "Ingrese un email valido";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  email = resultado.value;
  console.log(email);

  socket.emit("MensajeConexion", { email, role: "Admin" });
});

const botonChat = document.getElementById("botonChat");
const valInput = document.getElementById("chatbox");

botonChat.addEventListener("click", () => {
  const mensaje = valInput.value.trim();

  if (mensaje.length > 0) {
    socket.emit("mensaje", {
      email: email,
      message: mensaje,
    });
    valInput.value = "";
  }
});

socket.on("mensajes", (mensajes) => {
  const parrafosMensajes = document.getElementById("parrafosMensajes");
  parrafosMensajes.innerHTML = "";

  mensajes.forEach((mensaje) => {
    const fecha = new Date(mensaje.postTime).toLocaleString();
    parrafosMensajes.innerHTML += `<p>${fecha}: ${mensaje.email} escribió ${mensaje.message}</p>`;
  });
});
