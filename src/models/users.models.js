import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { CartModel } from "./cart.models.js";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  age: {
    required: true,
    type: Number,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
});
userSchema.plugin(paginate);

userSchema.pre("save", async function (next) {
  try {
    const newCart = await CartModel.create({});
    this.cart = newCart._id;
  } catch (error) {
    next(error);
  }
});
//Parametro 1: Nombre de la coleccion - Parametro 2:Schema
export const userModel = model("users", userSchema);
