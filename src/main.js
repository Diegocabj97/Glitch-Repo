//Routers y DOTENV
import router from "./Routes/index.routes.js";
import "dotenv/config";
//////////////////////
//EXPREESS SOCKET y CORS
import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import session from "express-session";
import cors from "cors";
//////////////////////
//PATH
import path from "path";
import { __dirname } from "./path.js";
//MONGO Y COOKIE PARSER
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
//////////////////////
//PASSPORT Y MODELS
import passport from "passport";
import initializePassport from "./config/passport.js";
import { productModel } from "./models/products.models.js";
import { MsgModel } from "./models/messages.models.js";
//////////////////////
//MAILING
import nodemailer from "nodemailer";
//////////////////////

// CORS OPTIONS
const whiteList = ["http://localhost:5173/"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) != 1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Acceso denegado"));
    }
  },
  credentials: true,
};
///////////////////////
const app = express();
const PORT = 8080;

//MAILING

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "diegojadrian97@gmail.com",
    pass: process.env.PASSWORD_EMAIL,
    authMethod: "LOGIN",
  },
});
app.get("/mail", async (req, res) => {
  const resultado = await transporter.sendMail({
    from: "diegojadrian97@gmail.com",
    to: "diegocabj97@hotmail.com",
    subject: "Prueba de mail",
    html: `
    <div>
      <h1>
      Holi toy probando mandar a traves de mi app
      </h1>
    </div>`,
    attachments: [
      {
        filename: "TestImg",
        path: __dirname + "/img/testimg.jpg",
        cid: "test.jpg",
      }],
  });
  console.log(resultado);
  res.send("Email enviado");
});
//////////////////////
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

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./Views"));
app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 10000000,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

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
    const productos = productModel.find[1];
    socket.emit("allProds", productos);
  });
});

//Routes
app.use("/", router);
app.use("/static", express.static(path.join(__dirname, "/public")));
app.use("/chat", express.static(path.join(__dirname, "/public")));
app.use("/home", express.static(path.join(__dirname, "/public")));
app.use("/realtimeproducts", express.static(path.join(__dirname, "/public")));
app.use("/login", express.static(path.join(__dirname, "/public")));
app.use("/register", express.static(path.join(__dirname, "/public")));
app.use(
  "/api/sessions/logout",
  express.static(path.join(__dirname, "/public"))
);

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
app.get("/login", (req, res) => {
  res.render("login", {
    css: "login.css",
    title: "Login",
    js: "login.js",
  });
});
app.get("/logout", (req, res) => {
  res.render("logout", {
    css: "login.css",
    title: "Login",
    js: "logout.js",
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
app.get("/newUser", (req, res) => {
  res.render("newUser", {
    title: "newUser",
    js: "newUser.js",
    css: "newUser.css",
  });
});
