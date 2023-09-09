import { Router } from "express";
import { CartModel } from "../models/cart.models.js";
import { productModel } from "../models/products.models.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  const carts = await CartModel.find();
  res.status(200).send(carts);
});

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await CartModel.create();
    res.status(200).send({ respuesta: "Ok", mensaje: cart });
  } catch (error) {
    res.status(400).send({
      respuesta: "Error al crear carrito",
      mensaje: error,
    });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await CartModel.findById(cid);
  if (cart) {
    res.status(200).send(
      `Carrito nro: ${cid}.         
      Contiene estos productos en el carrito ` + JSON.stringify(cart.products)
    );
  } else {
    res.status(404).send("Carrito no encontrado");
  }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await CartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);
      //Busco si existe en la BDD, no en el carrito
      if (prod) {
        const indice = cart.products.findIndex((prod) => prod.id_prod === pid);
        if (indice != -1) {
          cart.products[indice].quantity = quantity;
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity });
        }
        await CartModel.findByIdAndUpdate(cid, cart);
        res.status(200).send({ respuesta: "Ok", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error al agregar un producto a este carrito",
          mensaje: "Not Found",
        });
      }
    }
  } catch {
    res.status(404).send({
      respuesta: "Error al agregar un producto a este carrito",
      mensaje: "Not Found",
    });
  }

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).send("Cantidad inválida");
  }

  const productAdded = await CartModel.create(cid, pid, parseInt(quantity));

  if (productAdded) {
    res
      .status(200)
      .send(
        `Carrito ${cid},Producto nro: ${pid} +  agregado al carrito correctamente`
      );
  } else {
    res.status(404).send("Carrito o producto no encontrado");
  }
});

export default cartRouter;
