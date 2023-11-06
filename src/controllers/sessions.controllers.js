import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    if (!req.user) {
      // Si req.user existe, significa que el usuario ha iniciado sesión.
      res.status(200).send({
        mensaje: "Usuario Invalido",
      });
    } else {
      //Sin jwt / session en BDD
      /*  req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
      
      }; 
        res.status(200).send({ mensaje: "Has iniciado sesión" });
        */
      const token = generateToken(req.user);

      res
        .status(200)
        .send({ mensaje: "Has iniciado sesión  /  token: ", token });
      console.log("Has iniciado sesión");
    }
  } catch (error) {
    res.status(500).send({ mensaje: `Error al iniciar sesión ${error}` });
  }
};
export const register = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(501).send(console.log("Usuario ya existente"));
    } else {
      res.status(200).send(console.log("Usuario registrado"));
    }
  } catch (error) {
    res.status(500).send(console.log(`Error al registrar usuario ${error}`));
  }
};
export const logout = async (req, res) => {
  try {
    //Si la sesión se crea en la BDD
    /* if (req.session.login) {
      req.session.destroy();
    } */
    res.clearCookie("jwtCookie", { path: ("/") });
    console.log("Usuario deslogeado");
    res.status(200).send("Usuario deslogeado");
  } catch (error) {
    res.status(500).send({ resultado: "Error al cerrar sesión", error: error });
  }
};

export const tryJwt = async (req, res) => {
  console.log(req);
  res.send(req.user);
};

export const current = async (req, res) => {
  res.send(req.user);
};

export const GithubLogin = async (req, res) => {
  req.session.user = req.user;
  res.status(200).send({ mensaje: "Usuario logeado con Github" });
  res.redirect("/");
};
