import { CartModel } from "../models/cart.models.js";
import { productModel } from "../models/products.models.js";

export const getCart = async (req, res) => {
  const carts = await CartModel.find();
  res.status(200).send(carts);
};
