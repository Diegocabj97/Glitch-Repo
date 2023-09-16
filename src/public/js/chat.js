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
const parrafosMensajes = document.getElementById("parrafosMensajes");
const valInput = document.getElementById("chatbox");

botonChat.addEventListener("click", () => {
  let fechaActual = new Date().toLocaleString();

  if (valInput.value.trim().length > 0) {
    socket.emit("mensaje", {
      fecha: fechaActual,
      email: email,
      message: valInput.value, // Asegúrate de que valInput.value contenga el mensaje
    });
    valInput.value = "";
  }
});

socket.on("mensajes", (arraymensajes) => {
  parrafosMensajes.innerHTML = "";
  arraymensajes.forEach((mensaje) => {
    parrafosMensajes.innerHTML += `<p>${mensaje.fecha}: ${mensaje.email} escribió ${mensaje.message}`;
  });
});
