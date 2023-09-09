//Routers
import ProdsRouter from "./Routes/Products.Routes.js";
import cartRouter from "./Routes/Cart.Routes.js";
import userRouter from "./Routes/users.routes.js";

//Express y socket
import express from "express";
import path from "path";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
const app = express();
const PORT = 8080;
mongoose
  .connect(
    "mongodb+srv://diegojadrian97:<password>@cluster0.fnd7hyr.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("BDD conectada"))
  .catch(() => console.log("Error al conectarse a la BDD"));

const serverExpress = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
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
  socket.on("nuevoProducto", (newProd) => {
    productos.push(newProd);
    socket.emit("nuevoProducto", productos); // Emitir la lista actualizada a todos los clientes
    console.log(productos);
  });
  socket.on("EliminarProd", (deleteProd) => {
    const deleteCode = deleteProd.code;
    const indexProd = productos.findIndex((prod) => prod.code === deleteCode);
    if (indexProd !== -1) {
      productos.splice(indexProd, 1);
      socket.emit("allProds", productos); // Emitir la lista actualizada de productos a todos los clientes
      console.log("Producto eliminado:", deleteCode);
    } else {
      console.log("Producto no encontrado para eliminar", deleteCode);
    }
  });

  socket.on("allProds", async () => {
    socket.emit("allProds", productos);
  });
});

//Pagina home con productos

//Routes
app.use("/api/products", ProdsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/users", userRouter);
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/chat", express.static(path.join(__dirname, "/public")));
app.use("/home", express.static(path.join(__dirname, "/public")));
app.use("/realtimeproducts", express.static(path.join(__dirname, "/public")));

app.get("/Chat", (req, res) => {
  res.render("chat", {
    css: "products.css",
    title: "Chat",
    js: "chat.js",
  });
});
app.get("/home", (req, res) => {
  res.render("home", {
    title: "Home",
    js: "home.js",
    type: "modules",
    css: "home.css",
  });
});
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Real Time Prods",
    js: "realTimeProducts.js",
    css: "realTimeProducts.css",
  });
});
