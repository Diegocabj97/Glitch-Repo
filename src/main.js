import express from "express";
import path from "path";
import ProdsRouter from "./Routes/Products.Routes.js";
import cartRouter from "./Routes/Cart.Routes.js";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
const app = express();

const PORT = 8080;
const serverExpress = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine()); // defino que motor de plantillas voy a utilizar y su configuracion
app.set("view engine", "handlebars"); // Settign de mi app de handlebars
app.set("views", path.resolve(__dirname, "./Views")); //Resolver rutas absolutas a traves de rutas relativas

//Server socket io
const io = new Server(serverExpress);
const mensajes = [];
io.on("connection", (socket) => {
  console.log("servidor Socket.io conectado");

  socket.on("MensajeConexion", (user) => {
    if (user.role === "Admin") {
      socket.emit("credencialesConexion", "Usuario valido");
    } else {
      socket.emit("credencialesConexion", "Usuario no valido");
    }
  });
  socket.on("mensaje", (infoMensaje) => {
    console.log(infoMensaje);
    mensajes.push(infoMensaje);
    socket.emit("mensajes", mensajes);
  });
});

//Routes
app.use("/api/products", ProdsRouter);
app.use("/api/cart", cartRouter);
app.use("/static", express.static(path.join(__dirname, "/public")));
app.get("/static", (req, res) => {
  res.render("chat");
});
