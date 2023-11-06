import jwt from "jsonwebtoken";
import "dotenv/config"
export const generateToken = (user) => {
  /*
        1° parametro: Objeto asociado al token (Usuario)
        2° parametro: Clave privada para el cifrado
        3° parametro: Tiempo de expiracion
    */

  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return token;
};
/*  generateToken({
  _id: "6515cc3370b195f75c1b6c4a",
  first_name: "Diego Javier",
  last_name: "Adrian",
  age: "26",
  email: "test@test.com",
  password: "$2b$15$69cKFv1113t7y0n08rn1Ku.s4tn3oDMPrkdkAHR/UlnG8I6js8Nv6",
  role: "user",
});  */

export const authToken = (req, res, next) => {
  //Consultar al header para obtener el Token
  const authHeader = req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Usuario no autenticado" });
  }

  const token = authHeader.split(" ")[1]; //Obtengo el token y descarto el Bearer

  jwt.sign(token, process.env.JWT_SECRET, (error, credential) => {
    if (error) {
      return res
        .status(403)
        .send({ error: "Usuario no autorizado, token invalido" });
    }
  });

  //Usuario valido
  req.user = credential.user;
  next();
};
