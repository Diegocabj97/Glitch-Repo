import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  edad: Number,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.plugin(paginate);
//Parametro 1: Nombre de la coleccion - Parametro 2:Schema
export const userModel = model("users", userSchema);
