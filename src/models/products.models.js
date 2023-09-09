import { Schema, model } from "mongoose";

const userSchema = new Schema({
  code: {
    type: String,
    unique: true,
  },
  title: String,
  price: Number,
  thumbnail: String,
  stock: Number,
  category: String,
  description: String,
});

//Parametro 1: Nombre de la coleccion - Parametro 2:Schema
export const userModel = model("products", userSchema);
