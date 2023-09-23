//Routers
import ProdsRouter from "./Routes/Products.Routes.js";
import cartRouter from "./Routes/Cart.Routes.js";
import userRouter from "./Routes/users.routes.js";
import msgRouter from "./Routes/messages.routes.js";
//Express y socket
import express from "express";
import path from "path";
import { __dirname } from "./path.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { MsgModel } from "./models/messages.models.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import "dotenv/config";
import MongoStore from "connect-mongo";
import SessionRouter from "./Routes/session.routes.js";
const app = express();
const PORT = 8080;

//BDD
mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("BDD conectada");

    /*   const resCartProds = await CartModel.findOne({
      _id: "6506041a8b0752b8b129f0bd",
    });
    console.log(JSON.stringify(resCartProds)); */

    /* const resUsers = await userModel.paginate(
      { limit: 20 },
      { sort: { edad: "asc" } }
    );
    console.log(resUsers); */
  })
  .catch(() => console.log("Error al conectarse a la BDD"));
const serverExpress = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine()); // defino que motor de plantillas voy a utilizar y su configuracion
app.set("view engine", "handlebars"); // Settign de mi app de handlebars
app.set("views", path.resolve(__dirname, "./Views")); //Resolver rutas absolutas a traves de rutas relativas
app.use(cookieParser(process.env.SIGNED_COOKIE)); //Cookie firmada
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 1,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false, //Fuerzo a que se intente guardar a pesar de no tener modificaciones en datos
    saveUninitialized: false, //Fuerzo a guardar la session a pesar de no tener ningun dato
  })
);

////////////////////////////////////////////////

//Server socket io
const io = new Server(serverExpress);
io.on("connection", (socket) => {
  console.log("servidor Socket.io conectado");

  socket.on("MensajeConexion", (email) => {
    if (email.role === "Admin") {
      socket.emit("credencialesConexion", "Usuario valido");
    } else {
      socket.emit("credencialesConexion", "Usuario no valido");
    }
  });

  socket.on("mensaje", async (infoMensaje) => {
    try {
      infoMensaje.postTime = new Date();
      await MsgModel.create(infoMensaje);
      const allMsgs = await MsgModel.find();
      io.emit("mensajes", [...allMsgs]);
    } catch (error) {
      console.error(error);
    }
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

//Routes
app.use("/api/products", ProdsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/messages", msgRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", SessionRouter);
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/chat", express.static(path.join(__dirname, "/public")));
app.use("/home", express.static(path.join(__dirname, "/public")));
app.use("/realtimeproducts", express.static(path.join(__dirname, "/public")));

app.get("/setCookie", (req, res) => {
  res
    .cookie("cookiecookie", "Esto es una cookie firmada", {
      maxAge: 60000,
      signed: true,
    })
    .send("cookie generada");
});

app.get("/getCookie", (req, res) => {
  res.send(req.signedCookies);
});

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
