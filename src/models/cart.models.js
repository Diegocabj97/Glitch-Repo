import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  id: Number,
  products: {
    type: [
      {
        id_prod: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  default: [],
});
cartSchema.pre("findOne", function () {
  this.populate("products.id_prod");
});
//Parametro 1: Nombre de la coleccion - Parametro 2:Schema
export const CartModel = model("carts", cartSchema);
