import { Router } from "express";
import { CartManager, Cart } from "../CartManager.js";

const cartRouter = Router();
const cartManager = new CartManager();

cartRouter.get("/", async (req, res) => {
  const carts = await cartManager.getCart();
  res.status(200).send(carts);
});

cartRouter.post("/", async (req, res) => {
  const newCart = new Cart();
  await cartManager.addCart(newCart);
  res.status(201).send(newCart);
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
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
  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).send("Cantidad inválida");
  }

  const productAdded = await cartManager.addProductToCart(
    cid,
    pid,
    parseInt(quantity)
  );

  if (productAdded) {
    res
      .status(201)
      .send(
        `Carrito ${cid},Producto nro: ${pid} +  agregado al carrito correctamente`
      );
  } else {
    res.status(404).send("Carrito o producto no encontrado");
  }
});

export default cartRouter;
