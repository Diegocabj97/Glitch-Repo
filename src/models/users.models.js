import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

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
});
userSchema.plugin(paginate);
//Parametro 1: Nombre de la coleccion - Parametro 2:Schema
export const userModel = model("users", userSchema);
