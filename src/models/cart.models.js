import { Schema, model } from "mongoose";

const userSchema = new Schema({
  id: {
    unique: true,
  },
  products: {
    type: Array,
    product: Number,
    quantity: Number,
  },
});

//Parametro 1: Nombre de la coleccion - Parametro 2:Schema
export const userModel = model("carts", userSchema);
